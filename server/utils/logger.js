import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, '../logs');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'app.log');
const errorFile = path.join(logDir, 'error.log');

// Ensure log files exist
[logFile, errorFile].forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '');
  }
});

const timestamp = () => new Date().toISOString();

const formatError = (error) => {
  if (!error) return 'No error details';
  return `Message: ${error.message}\nStack: ${error.stack || 'No stack trace'}`;
};

const formatMeta = (meta) => {
  try {
    return JSON.stringify(meta, null, 2);
  } catch (err) {
    return 'Unable to stringify meta data';
  }
};

const logger = {
  info: (message, meta = {}) => {
    try {
      const log = `[${timestamp()}] INFO: ${message}\nMeta: ${formatMeta(meta)}\n\n`;
      console.log(log);
      fs.appendFileSync(logFile, log);
    } catch (err) {
      console.error('Logging error:', err);
    }
  },

  warn: (message, meta = {}) => {
    try {
      const log = `[${timestamp()}] WARN: ${message}\nMeta: ${formatMeta(meta)}\n\n`;
      console.warn(log);
      fs.appendFileSync(logFile, log);
    } catch (err) {
      console.error('Logging error:', err);
    }
  },

  error: (message, error = null, meta = {}) => {
    try {
      const errorLog = `[${timestamp()}] ERROR: ${message}\n${formatError(error)}\nMeta: ${formatMeta(meta)}\n\n`;
      console.error(errorLog);
      fs.appendFileSync(errorFile, errorLog);
    } catch (err) {
      console.error('Logging error:', err);
    }
  },

  request: (req) => {
    try {
      const sanitizedHeaders = { ...req.headers };
      delete sanitizedHeaders.cookie; // Don't log cookies
      delete sanitizedHeaders.authorization; // Don't log auth tokens

      const sanitizedBody = { ...req.body };
      if (sanitizedBody.password) {
        sanitizedBody.password = '[REDACTED]';
      }

      const log = `[${timestamp()}] REQUEST: ${req.method} ${req.url}\nHeaders: ${formatMeta(sanitizedHeaders)}\nBody: ${formatMeta(sanitizedBody)}\n\n`;
      fs.appendFileSync(logFile, log);
    } catch (err) {
      console.error('Logging error:', err);
    }
  },

  clearLogs: () => {
    try {
      fs.writeFileSync(logFile, '');
      fs.writeFileSync(errorFile, '');
    } catch (err) {
      console.error('Error clearing logs:', err);
    }
  }
};

// Clear logs on startup in development
if (process.env.NODE_ENV === 'development') {
  logger.clearLogs();
}

export default logger;