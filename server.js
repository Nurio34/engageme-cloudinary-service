import { config } from "dotenv";
import express from "express";
import cors from "cors";
import Route from "./route.js";
import multer from "multer";
import { createServer } from "http";
import { initializeSocket } from "./socket/index.js";
import rateLimit from "express-rate-limit";

config();
const PORT = process.env.PORT;

const app = express();
const server = createServer(app);

// Rate limit middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use("/", apiLimiter);

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
  console.log(err);

  next(err);
});

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
