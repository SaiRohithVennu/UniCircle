import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signup: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    department: string;
    gmail: string;
  }) => Promise<void>;
  verifyEmail: (email: string, otp: string, signupData: any) => Promise<void>;
  resendEmailOTP: (email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkUserExists: (email: string) => Promise<boolean>;
}

// Function to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  signup: async (userData) => {
    try {
      set({ loading: true, error: null });

      // Check if user exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Generate OTP
      const otp = generateOTP();

      // Send OTP via email using Supabase Edge Function
      const { error: otpError } = await supabase.functions.invoke('send-email-otp', {
        body: { email: userData.email, otp }
      });

      if (otpError) throw new Error('Failed to send verification code');

      // Store OTP in session storage for verification
      sessionStorage.setItem('signup_otp', otp);
      sessionStorage.setItem('signup_data', JSON.stringify(userData));

      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  verifyEmail: async (email: string, otp: string, signupData: any) => {
    try {
      set({ loading: true, error: null });

      const storedOTP = sessionStorage.getItem('signup_otp');
      
      if (!storedOTP) {
        throw new Error('Verification session expired. Please try again.');
      }

      if (otp !== storedOTP) {
        throw new Error('Invalid verification code');
      }

      // Create user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            phone: signupData.phone,
            department: signupData.department,
            gmail: signupData.gmail
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Failed to create account');

      // Clean up session storage
      sessionStorage.removeItem('signup_otp');
      sessionStorage.removeItem('signup_data');

      set({ isAuthenticated: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Verification failed';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resendEmailOTP: async (email: string) => {
    try {
      set({ loading: true, error: null });

      const otp = generateOTP();
      
      const { error: otpError } = await supabase.functions.invoke('send-email-otp', {
        body: { email, otp }
      });

      if (otpError) throw new Error('Failed to send verification code');

      sessionStorage.setItem('signup_otp', otp);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resend code';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
      if (!data.user) throw new Error('Login failed');

      // Fetch the user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      set({ 
        user: profile,
        isAuthenticated: true,
        error: null 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),

  checkUserExists: async (email) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return false;
        }
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking user:', error);
      return false;
    }
  }
}));