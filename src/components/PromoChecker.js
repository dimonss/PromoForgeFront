import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { promoAPI } from '../services/api';
import { toast } from 'react-toastify';
import { QrCode, Search, CheckCircle, XCircle, Camera } from 'lucide-react';
import QRScanner from './QRScanner';

const PromoChecker = () => {
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const { user, logout } = useAuth();

  const handleCheckPromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await promoAPI.checkStatus(promoCode.trim());
      setResult(response.data);
      toast.success('Promo code status retrieved successfully');
    } catch (error) {
      console.error('Check promo code error:', error);
      toast.error(error.response?.data?.error || 'Failed to check promo code');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleScanResult = (scannedCode) => {
    setPromoCode(scannedCode);
    setShowScanner(false);
    toast.success('Promo code scanned successfully');
  };

  const clearResult = () => {
    setResult(null);
    setPromoCode('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <QrCode className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">PromoForge</h1>
          <p className="mt-2 text-gray-600">Promo Code Checker</p>
          <p className="text-sm text-gray-500">Welcome, {user?.fullName || user?.username}</p>
        </div>

        {/* Promo Code Input */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Check Promo Code</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
                Promo Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="promoCode"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter or scan promo code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleCheckPromo()}
                />
                <button
                  onClick={() => setShowScanner(!showScanner)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  title="Toggle QR Scanner"
                >
                  <Camera className="h-5 w-5" />
                </button>
                <button
                  onClick={handleCheckPromo}
                  disabled={loading || !promoCode.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* QR Scanner */}
            {showScanner && (
              <QRScanner
                onScan={handleScanResult}
                onClose={() => setShowScanner(false)}
              />
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Promo Code Status</h3>
              <button
                onClick={clearResult}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {result.status?.isValid ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                <span className={`font-medium ${result.status?.isValid ? 'text-green-700' : 'text-red-700'}`}>
                  {result.status?.isValid ? 'Valid' : 'Invalid'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Code</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{result.status?.code || promoCode}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="mt-1 text-sm text-gray-900">{result.status?.type || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Value</label>
                  <p className="mt-1 text-sm text-gray-900">{result.status?.value || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {result.status?.expiryDate ? new Date(result.status.expiryDate).toLocaleDateString() : 'No expiry'}
                  </p>
                </div>
              </div>

              {result.status?.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{result.status.description}</p>
                </div>
              )}

              {result.status?.isUsed !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Usage Status</label>
                  <p className={`mt-1 text-sm ${result.status.isUsed ? 'text-red-600' : 'text-green-600'}`}>
                    {result.status.isUsed ? 'Already Used' : 'Available'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoChecker;
