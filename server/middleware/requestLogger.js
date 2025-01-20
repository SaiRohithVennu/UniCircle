import logger from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  // Log the incoming request
  logger.request(req);

  // Log response status code
  const originalSend = res.send;
  res.send = function(data) {
    logger.info(`Response sent`, {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode
    });
    originalSend.call(this, data);
  };

  next();
};