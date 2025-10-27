import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import type { User, AuthContextValue } from '../types';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          console.log('AuthContext - Initializing auth with stored token');
          const response = await authAPI.getCurrentUser();
          console.log('AuthContext - getCurrentUser response:', response);
          console.log('AuthContext - getCurrentUser data:', response.data);
          
          setUser(response.data.user);
          setToken(storedToken);
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('AuthContext - Starting login process');
      const response = await authAPI.login(username, password);
      
      console.log('AuthContext - Full response:', response);
      console.log('AuthContext - Response data:', response.data);
      
      // Extract data from response.data
      const { token: newToken, user: userData } = response.data;
      
      console.log('AuthContext - Extracted data:', { token: !!newToken, user: userData });
      
      if (!newToken || !userData) {
        console.error('AuthContext - Missing token or user data in response');
        return { 
          success: false, 
          error: 'Invalid response from server' 
        };
      }
      
      // Update localStorage first
      localStorage.setItem('token', newToken);
      
      // Update state immediately
      setToken(newToken);
      setUser(userData);
      setLoading(false);
      
      console.log('AuthContext - State updated, isAuthenticated should be:', !!userData);
      
      return { success: true };
    } catch (error: any) {
      console.error('AuthContext - Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const logout = (): void => {
    console.log('AuthContext - Logging out');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };


  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  // Debug logging
  console.log('AuthContext - Current state:', { 
    user: !!user, 
    token: !!token, 
    loading, 
    isAuthenticated: !!user 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

