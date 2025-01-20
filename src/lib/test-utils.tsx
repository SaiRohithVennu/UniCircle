import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';

// Custom render with providers
function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    ),
    ...options,
  });
}

// Reset auth store between tests
function resetAuthStore() {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
  });
}

// Mock auth user for testing
const mockUser = {
  id: '123',
  email: 'test@mail.uc.edu',
  name: 'Test User',
  department: 'Computer Science',
  avatar_url: null,
};

export * from '@testing-library/react';
export { render, resetAuthStore, mockUser };