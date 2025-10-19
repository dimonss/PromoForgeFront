import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Settings as SettingsIcon, 
  User
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">User Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {user?.fullName}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {user?.username}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md font-mono">
                {user?.id}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <SettingsIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">System Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Version
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              PromoForge v1.0.0
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Environment
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {process.env.NODE_ENV || 'development'}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Endpoint
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md font-mono">
              {process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Login
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Security Notice
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Always use a strong, unique password</li>
                <li>Change your password regularly</li>
                <li>Never share your login credentials</li>
                <li>Log out when finished using the system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
