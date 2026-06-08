import ApiError from "../errors/ApiError.js";

const Register_User = (db) => (req, res, next) => {
  try {
    let { user_name, event_id,event_name } = req.body;

    user_name = user_name?.trim().replace(/\s+/g, " ");
    event_id = Number(event_id);

    if (!user_name || !event_id) {
      throw new ApiError(400, "User Name and Event ID are required");
    }

    if (user_name.length < 3) {
      throw new ApiError(400, "User Name must be at least 3 characters long");
    }

    const event = db.prepare(
      "SELECT * FROM events WHERE id = ?"
    ).get(event_id);

    if (!event) {
      throw new ApiError(404, "Event not found cannot register user");
    }

    
    if (new Date(event.event_date) < new Date()) {
      throw new ApiError(400, "Event date has already passed");
    }

    const existingRegistration = db.prepare(
      "SELECT * FROM registrations WHERE user_name = ? AND event_id = ? AND status = 'active'"
    ).get(user_name, event_id);

    if (existingRegistration) {
      throw new ApiError(400, "User already registered for this event");
    }



    const now = new Date();
const registered_at = new Date(now.getTime() + 5 * 60 * 60 * 1000)
  .toISOString()
  .replace('T', ' ')
  .slice(0, 19);

    const tx = db.transaction(() => {
      const freshEvent = db.prepare(
        "SELECT * FROM events WHERE id = ?"
      ).get(event_id);

      if (freshEvent.available_seats <= 0) {
        throw new ApiError(400, "Event is full user cannot be registered");
      }

      db.prepare(
        `INSERT INTO registrations (user_name, event_id, registered_at, status)
         VALUES (?, ?, ?, 'active')`
      ).run(user_name, event_id, registered_at);

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
      event_name: event.event_name,
      event_id,
      event_name: event.event_name,
      registered_at: registered_at
    });

  } catch (error) {
    next(error);
  }
};



const Cancel_Registration = (db) => (req, res, next) => {
  try {
    let { user_name, event_id } = req.body;

    user_name = user_name?.trim().replace(/\s+/g, " ");
    event_id = Number(event_id);

    if (!user_name || !event_id) {
      throw new ApiError(400, "User Name and Event ID are required");
    }
    //check user name length
    if (user_name.length < 3) {
      throw new ApiError(400, "User Name must be at least 3 characters long");
    }
    const registration = db.prepare(
      "SELECT * FROM registrations WHERE user_name = ? AND event_id = ? AND status = 'active'"
    ).get(user_name, event_id);

    if (!registration) {
      throw new ApiError(400, "User is not registered for this event");
    }

    const tx = db.transaction(() => {
      db.prepare(
        "UPDATE registrations SET status = 'cancelled' WHERE user_name = ? AND event_id = ? AND status = 'active'"
      ).run(user_name, event_id);

      db.prepare(
        `UPDATE events 
         SET registered_seats = registered_seats - 1,
             available_seats = available_seats + 1
         WHERE id = ?`
      ).run(event_id);
    });

    tx();

    res.status(200).json({
      success: true,
      message: "Registration cancelled successfully and seat available of this event ",
      user_name,
      event_id,
    });

  }
    catch (error) {
    next(error);
  }
};

export {
   Register_User,
   Cancel_Registration
  };