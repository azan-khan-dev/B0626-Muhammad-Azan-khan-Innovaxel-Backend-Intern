import ApiError from "../errors/ApiError.js";
import { parseDate, formatDate } from "../utils/date.utils.js";

/* =========================
   CREATE EVENT
========================= */
const createEvent = (db) => (req, res, next) => {
  try {
    const event_name = req.body.event_name?.trim().replace(/\s+/g, " ");
    const event_date = req.body.event_date;
    const total_seats = Number(req.body.total_seats);

    if (!event_name || !event_date || !total_seats) {
      throw new ApiError(400, "All fields are required");
    }

    if (total_seats <= 0) {
      throw new ApiError(400, "Seats must be greater than 0");
    }

    const parsedDate = parseDate(event_date);

    if (!parsedDate || new Date(parsedDate) <= new Date()) {
      throw new ApiError(400, "Invalid future date required");
    }

    const existing = db
      .prepare("SELECT 1 FROM events WHERE event_name = ?")
      .get(event_name);

    if (existing) {
      throw new ApiError(409, "Event already exists");
    }

    const result = db.prepare(`
      INSERT INTO events 
      (event_name, total_seats, registered_seats, available_seats, event_date)
      VALUES (?, ?, 0, ?, ?)
    `).run(event_name, total_seats, total_seats, parsedDate);

    res.status(201).json({
      success: true,
      eventId: result.lastInsertRowid,
      event_name,
      total_seats,
      available_seats: total_seats,
      event_date: formatDate(parsedDate),
    });

  } catch (err) {
    next(err);
  }
};

/* =========================
   GET EVENTS
========================= */
const getEvents = (db) => (req, res, next) => {
  try {
    const { upcoming_only, sort_by_date } = req.query;

    let query = `
      SELECT 
        id,
        event_name,
        total_seats,
        registered_seats,
        available_seats,
        event_date
      FROM events
    `;

    if (upcoming_only === "true") {
      query += ` WHERE event_date > date('now')`;
    }

    if (sort_by_date === "true") {
      query += ` ORDER BY event_date ASC`;
    }

    const events = db.prepare(query).all();

    const formattedEvents = events.map((event) => ({
      ...event,
      event_date: formatDate(event.event_date),
    }));

    res.status(200).json({
      success: true,
      total_events: formattedEvents.length,
      data: formattedEvents,
    });

  } catch (err) {
    next(err);
  }
};

export { createEvent, getEvents };