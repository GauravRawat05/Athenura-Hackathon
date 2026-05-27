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
import cookieParser from 'cookie-parser'
import nodeCron from "node-cron";
import { syncHackathonStatuses } from "./modules/admin/hackathons/adminHackathon.service.js";
import { processPendingEmails } from "./modules/notifications/notification.cron.js";



const app = express();

// Middleware setup
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser())

//Allow all origins dynamically to support credentialed requests, methods, and headers
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

export const runHackathonStatusSync = async () => {
  try {
    const result = await syncHackathonStatuses();
    console.log("Hackathon status sync completed:", result);
  } catch (error) {
    console.error("Error during hackathon status sync:", error);
  }
};

// Schedule the task to run every minute for real-time status updates
nodeCron.schedule("* * * * *", runHackathonStatusSync);

// Schedule background email sending to prevent slow SMTP calls from causing server lag
nodeCron.schedule("*/1 * * * *", processPendingEmails);

// Run once on startup to sync any statuses missed during downtime
runHackathonStatusSync();

// API routes
app.use("/api/v1", router);

// Error handling middleware
app.use(errorHandler);

export default app;