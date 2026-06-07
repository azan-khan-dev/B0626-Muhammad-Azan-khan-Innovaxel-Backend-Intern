import ApiError from '../errors/ApiError.js';
import { parseDate, formatDate } from '../utils/date.utils.js';

const createEvent = (db) => (req, res, next) => {
  try {
    const { event_name, event_date } = req.body;

    // Fields check karo
    if (!event_name || !req.body.total_seats || !event_date) {
      throw new ApiError(400, 'All fields are required');
    }

    // Number check karo
    const total_seats = parseInt(req.body.total_seats);
    if (isNaN(total_seats)) {
      throw new ApiError(400, 'Total seats must be a valid number. Please enter a positive number');
    }

    if (event_name.length < 3) {
      throw new ApiError(400, 'Event name must be at least 3 characters long');
    }

    if (total_seats <= 0) {
      throw new ApiError(400, 'Total seats must be greater than zero');
    }

    // Date parse karo — koi bhi format chalta hai
    const parsedDate = parseDate(event_date);
    if (!parsedDate) {
      throw new ApiError(400, 'Invalid date format. Use YYYY-MM-DD or DD-MM-YYYY');
    }

    // Month valid hai?
    const month = parseInt(parsedDate.split('-')[1]);
    if (month < 1 || month > 12) {
      throw new ApiError(400, 'Invalid month. Month must be between 1 and 12');
    }

    // Future date check
    if (new Date(parsedDate) <= new Date()) {
      throw new ApiError(400, 'Event date must be in the future');
    }

    // Duplicate check
    const existingEvent = db.prepare(
      'SELECT * FROM events WHERE event_name = ?'
    ).get(event_name);

    if (existingEvent) {
      throw new ApiError(409, 'Event name already exists');
    }

    const result = db.prepare(
      'INSERT INTO events (event_name, total_seats, event_date) VALUES (?, ?, ?)'
    ).run(event_name, total_seats, parsedDate);

    res.status(201).json({
      success: true,
      eventId: result.lastInsertRowid,
      event_name,
      total_seats,
      event_date: formatDate(parsedDate), 
      message: 'Event created successfully',
    });

  } catch (err) {
    next(err);
  }
};
const getEvents = (db) => (req, res, next) => {
  try {
    const { upcoming_only, sort_by_date } = req.query;

    let query = `
      SELECT 
        id,
        event_name,
        registered_seats,
        (total_seats - registered_seats) AS available_seats,
        event_date
      FROM events
    `;

    if (upcoming_only === 'true') {
      query += ` WHERE event_date > date('now')`;
    }

    if (sort_by_date === 'true') {
      query += ` ORDER BY event_date ASC`;
    }

    const events = db.prepare(query).all();

    const formattedEvents = events.map(event => ({
      ...event,
      event_date: formatDate(event.event_date)
    }));

    res.status(200).json({
      success: true,
      total_events: formattedEvents.length,
      data: formattedEvents
    });

  } catch (err) {
    next(err);
  }
};
export { createEvent, getEvents };