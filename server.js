import { config } from "dotenv";
import express from "express";
import cors from "cors";
import Route from "./route.js";
import multer from "multer";
import { createServer } from "http";
import { initializeSocket } from "./socket/index.js";

config();
const PORT = process.env.PORT;

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: process.env.ORIGIN_URL,
  })
);

app.use(
  express.json({
    limit: "200mb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "200mb" }));

app.use(Route);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: "File too large" });
  }
  next(err);
});

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
