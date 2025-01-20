import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { MainContent } from '@/components/layout/main-content';
import { LoginPage } from '@/pages/login';
import { SignupPage } from '@/pages/signup';
import { VerifyEmailPage } from '@/pages/verify-email';
import { useAuthStore } from '@/stores/auth-store';

export function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Sidebar />
        <MainContent />
        <MobileNav />
      </div>
    </Router>
  );
}