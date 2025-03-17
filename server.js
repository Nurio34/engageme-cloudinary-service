import { config } from "dotenv";
import express from "express";
import cors from "cors";
import Route from "./route.js";
import multer from "multer";

config();
const PORT = process.env.PORT;

const app = express();

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
    // Handle Multer errors (e.g., file size exceeded)
    return res.status(400).json({ error: "File too large" });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
