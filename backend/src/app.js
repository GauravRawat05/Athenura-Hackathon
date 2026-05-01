/**
  app.js
  Main Express application setup, error handling, and routing initialization.
 */

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler.js";
import router from "./routes/api.js";

const app = express();

// Middleware setup
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

//Allow all origins, methods, and headers
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// API routes
app.use("/api/v1", router);

// Error handling middleware
app.use(errorHandler);

export default app;
