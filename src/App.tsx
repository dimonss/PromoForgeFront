import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import PromoChecker from './components/PromoChecker';
import PWAInstall from './components/PWAInstall';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Protected Route component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <div className="loading">
          <div className="spinner"></div>
          Loading...
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

interface PublicRouteProps {
  children: React.ReactNode;
}

// Public Route component (redirect if authenticated)
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, user, token } = useAuth();

  console.log('PublicRoute - isAuthenticated:', isAuthenticated, 'loading:', loading, 'user:', user, 'token:', !!token);

  if (loading) {
    console.log('PublicRoute - Still loading...');
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <div className="loading">
          <div className="spinner"></div>
          Loading...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    console.log('PublicRoute - User is authenticated, redirecting to checker');
    return <Navigate to="/checker" replace />;
  }

  console.log('PublicRoute - User not authenticated, showing login form');
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/checker" 
        element={
          <ProtectedRoute>
            <PromoChecker />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/" 
        element={<Navigate to="/checker" replace />}
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router basename="/promo_forge">
        <div className="App">
          <AppRoutes />
          <PWAInstall />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{
              top: 'max(2rem, env(safe-area-inset-top))',
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

