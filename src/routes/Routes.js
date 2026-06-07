import { Router } from "express";
import { createEvent, getEvents } from "../controllers/event.controller.js"; 

const initRoutes = (db) => {
const router = Router();

router.post('/events',createEvent(db));
router.get('/events', getEvents(db));

return router;
};

export default initRoutes;
