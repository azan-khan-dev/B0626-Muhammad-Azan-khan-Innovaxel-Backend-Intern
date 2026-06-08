import { Router } from "express";
import { createEvent, getEvents } from "../controllers/event.controller.js"; 
import { Cancel_Registration, Register_User } from "../controllers/user.controller.js";

const initRoutes = (db) => {
const router = Router();

router.post('/events',createEvent(db));
router.get('/', getEvents(db));
router.post('/register', Register_User(db));
router.patch('/cancel',Cancel_Registration(db));

return router;
};

export default initRoutes;
