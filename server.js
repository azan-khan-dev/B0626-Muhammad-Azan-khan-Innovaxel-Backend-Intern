import express from 'express';
import { db, migrate } from './src/config/database.js';
import initRoutes from './src/routes/routes.js';
import errorHandler from './src/middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

migrate(); // ← middlewares ke baad

app.use('/api', initRoutes(db));
app.use(errorHandler); // ← routes ke baad

const PORT = 3000;

app.listen(PORT, () => {
  //proper format localhost:3000/api/events
  console.log(`Server is running on http://localhost:${PORT}/api`);
});