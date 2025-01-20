import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { sendOTP, generateOTP } from '../services/twilio.js';
import { auth } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, department } = req.body;
    logger.info('Registration attempt', { email, phone, department });

    // Validate required fields
    if (!email || !password || !name || !phone || !department) {
      logger.warn('Missing required fields', { body: req.body });
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate UC email
    if (!email.endsWith('@mail.uc.edu')) {
      logger.warn('Invalid email domain', { email });
      return res.status(400).json({ error: 'Must use UC email address' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }]
    });
    
    if (existingUser) {
      logger.warn('User already exists', { 
        email: existingUser.email === email,
        phone: existingUser.phone === phone 
      });
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Email already registered' : 'Phone number already registered' 
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
      phone,
      department
    });

    // Generate and send OTP
    const otp = generateOTP();
    user.setVerificationCode(otp);
    await user.save();
    logger.info('User created successfully', { userId: user._id });

    // Send OTP
    const otpSent = await sendOTP(phone, otp);
    if (!otpSent) {
      logger.error('Failed to send OTP', null, { userId: user._id, phone });
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({ error: 'Failed to send verification code' });
    }

    res.status(201).json({
      message: 'Please verify your phone number with the code sent via SMS',
      userId: user._id
    });
  } catch (error) {
    logger.error('Registration error', error, { body: req.body });
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    logger.info('OTP verification attempt', { userId });

    if (!userId || !otp) {
      return res.status(400).json({ error: 'User ID and OTP are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      logger.warn('User not found for OTP verification', { userId });
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.verifyOTP(otp)) {
      logger.warn('Invalid OTP provided', { userId });
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    user.isPhoneVerified = true;
    user.phoneVerificationCode = undefined;
    await user.save();
    logger.info('OTP verified successfully', { userId });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (error) {
    logger.error('OTP verification error', error, { body: req.body });
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info('Login attempt', { email });
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('User not found during login', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Invalid password', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isPhoneVerified) {
      const otp = generateOTP();
      user.setVerificationCode(otp);
      await user.save();

      const otpSent = await sendOTP(user.phone, otp);
      if (!otpSent) {
        logger.error('Failed to send OTP during login', null, { userId: user._id });
        return res.status(500).json({ error: 'Failed to send verification code' });
      }

      return res.status(403).json({
        message: 'Please verify your phone number',
        userId: user._id
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    logger.info('Login successful', { userId: user._id });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (error) {
    logger.error('Login error', error, { body: req.body });
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  logger.info('User logged out');
  res.json({ message: 'Logged out successfully' });
});

export default router;