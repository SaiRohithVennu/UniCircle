import * as z from 'zod';

const phoneRegex = /^\d{10}$/;
const ucEmailSchema = z.string()
  .email()
  .regex(/@mail\.uc\.edu$/, 'Must be a valid UC email address');
const gmailSchema = z.string()
  .email()
  .regex(/@gmail\.com$/, 'Must be a valid Gmail address');

export const loginSchema = z.object({
  email: ucEmailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: ucEmailSchema,
  gmail: gmailSchema,
  phone: z.string().regex(phoneRegex, 'Phone number must be exactly 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  department: z.string().min(2, 'Department is required'),
});

export const resetPasswordSchema = z.object({
  email: ucEmailSchema,
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});