const winston = require("winston");

// Create a logger instance
const logger = winston.createLogger({
  level: "info", // Log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    // Console transport for logging to the console
    new winston.transports.Console(),
    // File transport for logging to a file
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Handle unhandled promise rejections and exceptions
process.on("unhandledRejection", (error) => {
  logger.error(`Unhandled Rejection: ${error.message}`);
});

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1); // Exit the process after logging
});

module.exports = logger;
