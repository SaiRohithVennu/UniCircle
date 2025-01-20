import twilio from 'twilio';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

// Development mode OTP handling
const sendDevOTP = (phoneNumber, otp) => {
  logger.info(`Development mode: Simulated OTP sent to ${phoneNumber}: ${otp}`);
  return true;
};

// Initialize Twilio client only in production
const initTwilioClient = () => {
  if (process.env.NODE_ENV === 'development') {
    logger.info('Development mode: Skipping Twilio initialization');
    return null;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();

  if (!accountSid || !authToken) {
    logger.warn('Twilio credentials not configured');
    return null;
  }

  try {
    return twilio(accountSid, authToken);
  } catch (error) {
    logger.error('Twilio client initialization failed', error);
    return null;
  }
};

const client = initTwilioClient();

export const sendOTP = async (phoneNumber, otp) => {
  // In development, always succeed and log the OTP
  if (process.env.NODE_ENV === 'development') {
    return sendDevOTP(phoneNumber, otp);
  }

  if (!client) {
    logger.warn('Twilio client not initialized, falling back to development mode');
    return sendDevOTP(phoneNumber, otp);
  }

  try {
    await client.messages.create({
      body: `Your Startup Circle verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    logger.info('OTP sent successfully', { phoneNumber });
    return true;
  } catch (error) {
    logger.error('Failed to send OTP', error, { phoneNumber });
    // In case of error, fall back to development mode
    return sendDevOTP(phoneNumber, otp);
  }
};

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  if (process.env.NODE_ENV === 'development') {
    logger.info('Development mode: Generated OTP', { otp });
  }
  return otp;
};