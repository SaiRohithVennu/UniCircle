import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, resetAuthStore, mockUser } from '@/lib/test-utils';
import { LoginPage } from '@/pages/login';
import { SignupPage } from '@/pages/signup';
import { useAuthStore } from '@/stores/auth-store';
import { supabase } from '@/lib/supabase';

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    resetAuthStore();
    vi.clearAllMocks();
  });

  describe('Login', () => {
    it('should show validation errors for invalid inputs', async () => {
      render(<LoginPage />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should successfully log in with valid credentials', async () => {
      // Mock successful login
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      render(<LoginPage />);
      
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@mail.uc.edu' },
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'password123' },
      });
      
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(useAuthStore.getState().isAuthenticated).toBe(true);
        expect(useAuthStore.getState().user).toEqual(mockUser);
      });
    });

    it('should show error message on login failure', async () => {
      // Mock login failure
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { user: null },
        error: new Error('Invalid credentials'),
      });

      render(<LoginPage />);
      
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@mail.uc.edu' },
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'wrongpassword' },
      });
      
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Signup', () => {
    it('should validate UC email domain', async () => {
      render(<SignupPage />);
      
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@gmail.com' },
      });
      
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/must be a valid UC email/i)).toBeInTheDocument();
      });
    });

    it('should successfully create account with valid data', async () => {
      // Mock successful signup
      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      render(<SignupPage />);
      
      fireEvent.change(screen.getByPlaceholderText(/name/i), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@mail.uc.edu' },
      });
      fireEvent.change(screen.getByPlaceholderText(/phone/i), {
        target: { value: '1234567890' },
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'password123' },
      });
      
      const departmentSelect = screen.getByLabelText(/program/i);
      fireEvent.change(departmentSelect, {
        target: { value: 'Computer Science' },
      });
      
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
          email: 'test@mail.uc.edu',
          password: 'password123',
          options: {
            data: {
              name: 'Test User',
              department: 'Computer Science',
            },
          },
        });
      });
    });
  });
});