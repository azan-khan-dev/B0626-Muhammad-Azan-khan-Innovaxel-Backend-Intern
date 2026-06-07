import ApiError from "../errors/ApiError.js";

const Register_User = (db) => (req, res, next) => {
  try {
    let { user_name, event_id } = req.body;

    user_name = user_name?.trim().replace(/\s+/g, " ");
    event_id = Number(event_id);

    if (!user_name || !event_id) {
      throw new ApiError(400, "User Name and Event ID are required");
    }

    if (user_name.length < 3) {
      throw new ApiError(400, "User Name must be at least 3 characters long");
    }

    // check event
    const event = db.prepare(
      "SELECT * FROM events WHERE id = ?"
    ).get(event_id);

    if (!event) {
      throw new ApiError(404, "Event not found cannot register user");
    }

    // FIXED date check
    if (new Date(event.event_date) < new Date()) {
      throw new ApiError(400, "Event date has already passed");
    }

    // duplicate check
    const existingRegistration = db.prepare(
      "SELECT * FROM registrations WHERE user_name = ? AND event_id = ? AND status = 'active'"
    ).get(user_name, event_id);

    if (existingRegistration) {
      throw new ApiError(400, "User already registered for this event");
    }

    // transaction (SAFE)
    const tx = db.transaction(() => {
      const freshEvent = db.prepare(
        "SELECT * FROM events WHERE id = ?"
      ).get(event_id);

      if (freshEvent.available_seats <= 0) {
        throw new ApiError(400, "Event is full user cannot be registered");
      }

      db.prepare(
        `INSERT INTO registrations (user_name, event_id, registered_at, status)
         VALUES (?, ?, datetime('now'), 'active')`
      ).run(user_name, event_id);

      db.prepare(
        `UPDATE events 
         SET registered_seats = registered_seats + 1,
             available_seats = available_seats - 1
         WHERE id = ?`
      ).run(event_id);
    });

    tx();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user_name,
      event_id,
      event_name: event.event_name,
      registered_at: new Date().toISOString(),
    });

  } catch (error) {
    next(error);
  }
};

export { Register_User };