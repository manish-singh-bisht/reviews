const express = require("express");
const cors = require("cors");
const compression = require("compression");
const cloudinary = require("cloudinary");
const { PORT, CLOUD_NAME, API_KEY, API_SECRET } = require("./config/index.js");
const userRouter = require("./routes/userRouter");
const spaceRouter = require("./routes/spaceRouter");
const reviewRouter = require("./routes/reviewRouter");
const publicRouter = require("./routes/publicRouter");
const app = express();

app.use(compression({ level: 6 }));

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const corsOptions = {
  origin: [
    "https://reviews-five-sigma.vercel.app",
    "https://review-widget-mauve.vercel.app",
  ],
  credentials: true,
};

const restrictedCorsOptions = {
  origin: [
    "https://reviews-five-sigma.vercel.app",
    "https://review-widget-mauve.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};

const publicCorsOptions = {
  origin: "*",
  methods: ["GET", "OPTIONS"],
  allowedHeaders: "*",
  maxAge: 86400,
};

app.use(express.json({ extended: true, limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/p", cors(publicCorsOptions), publicRouter);
app.use("/api/v1", cors(restrictedCorsOptions), userRouter);
app.use("/api/v1", cors(restrictedCorsOptions), spaceRouter);
app.use("/api/v1", cors(restrictedCorsOptions), reviewRouter);

let server;

async function startServer() {
  try {
    server = app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

async function gracefulShutdown() {
  console.log("Graceful shutdown initiated");

  if (server) {
    server.close(async (err) => {
      if (err) {
        console.error("Error closing HTTP server:", err);
        process.exit(1);
      }
      console.log("HTTP server closed");
      process.exit(0);
    });
  }
}

const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];
signals.forEach((signal) => {
  process.on(signal, () => {
    console.log(`Received ${signal}, starting graceful shutdown...`);
    gracefulShutdown();
  });
});

startServer();
