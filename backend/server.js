import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Log } from "../logging-middleware/log.js";
import urlRoutes from "./src/routes/urlRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", urlRoutes);

app.listen(8000, () => {
  Log("backend", "info", "config", "Server running on port 5000");
});
