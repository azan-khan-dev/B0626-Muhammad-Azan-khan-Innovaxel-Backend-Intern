import express from "express";
import { db, migrate } from "./src/config/database.js";

const app = express();
app.use(express.json());
const PORT = 3000;

migrate();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
