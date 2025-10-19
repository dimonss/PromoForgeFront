import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { promoAPI } from '../services/api';
import { validatePromoCode } from '../utils/validation';
import { toast } from 'react-toastify';
import { QrCode, Search, CheckCircle, XCircle, Camera, Ban } from 'lucide-react';
import QRScanner from './QRScanner';
import LogoutModal from './LogoutModal';
import DeactivateModal from './DeactivateModal';

const PromoChecker = () => {
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const { user, logout } = useAuth();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleCheckPromo = async () => {
    // Validate promo code format
    const validation = validatePromoCode(promoCode);
    if (!validation.isValid) {
      toast.error(validation.error);
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

  const handleScanResult = async (scannedCode) => {
    setPromoCode(scannedCode);
    setShowScanner(false);
    
    // Validate scanned promo code format
    const validation = validatePromoCode(scannedCode);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }
    
    // Automatically check the scanned promo code
    setLoading(true);
    setResult(null);

    try {
      const response = await promoAPI.checkStatus(scannedCode.trim());
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

  const clearResult = () => {
    setResult(null);
    setPromoCode('');
  };

  const handleDeactivateClick = () => {
    setShowDeactivateModal(true);
  };

  const handleDeactivateConfirm = async () => {
    // Validate promo code format before deactivation
    const validation = validatePromoCode(promoCode);
    if (!validation.isValid) {
      toast.error(validation.error);
      setShowDeactivateModal(false);
      return;
    }

    setDeactivateLoading(true);
    
    try {
      const response = await promoAPI.deactivate(promoCode.trim());
      toast.success('Промо-код успешно деактивирован');
      
      // Обновляем результат, чтобы показать деактивированный статус
      if (result && result.status) {
        setResult({
          ...result,
          status: {
            ...result.status,
            isActive: false,
            deactivatedAt: response.data.deactivatedAt,
            deactivatedBy: response.data.deactivatedBy
          }
        });
      }
      
      setShowDeactivateModal(false);
    } catch (error) {
      console.error('Deactivate promo code error:', error);
      toast.error(error.response?.data?.error || 'Ошибка при деактивации промо-кода');
    } finally {
      setDeactivateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">PromoForge</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">{user?.fullName || user?.username}</span>
              <button
                onClick={handleLogoutClick}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Выйти"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Promo Code Input */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Проверить промо-код</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
                Введите или отсканируйте промо-код
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Промо-код должен быть в формате UUID (36 символов с дефисами)
              </p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="promoCode"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Введите UUID промо-код (например: 550e8400-e29b-41d4-a716-446655440000)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors font-mono text-gray-900"
                    onKeyPress={(e) => e.key === 'Enter' && handleCheckPromo()}
                  />
                  {promoCode && (
                    <button
                      onClick={() => setPromoCode('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowScanner(!showScanner)}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    showScanner 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="QR Сканер"
                >
                  <Camera className="h-5 w-5" />
                </button>
                <button
                  onClick={handleCheckPromo}
                  disabled={loading || !promoCode.trim()}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="hidden sm:inline">Проверка...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span className="hidden sm:inline">Проверить</span>
                    </>
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
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Результат</h3>
              <button
                onClick={clearResult}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Очистить
              </button>
            </div>

            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center space-x-3">
                {result.status?.isActive ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                <span className={`font-medium ${result.status?.isActive ? 'text-green-700' : 'text-red-700'}`}>
                  {result.status?.isActive ? 'Активен' : 'Деактивирован'}
                </span>
              </div>

              {/* Code */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Код</p>
                <p className="text-xl font-mono font-semibold text-gray-900">
                  {result.status?.code || promoCode}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Дата создания</p>
                  <p className="font-medium text-gray-900">
                    {result.status?.createdAt ? new Date(result.status.createdAt).toLocaleString('ru-RU') : 'N/A'}
                  </p>
                </div>
                
                {result.status?.deactivatedAt && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Дата деактивации</p>
                    <p className="font-medium text-gray-900">
                      {new Date(result.status.deactivatedAt).toLocaleString('ru-RU')}
                    </p>
                  </div>
                )}
                
                {result.status?.deactivatedBy && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Деактивирован пользователем</p>
                    <p className="font-medium text-gray-900">
                      {result.status.deactivatedBy}
                    </p>
                  </div>
                )}
                
              </div>

              {/* Deactivate Button - only show for active codes */}
              {result.status?.isActive && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleDeactivateClick}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Ban className="h-4 w-4" />
                    <span>Деактивировать промо-код</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />

      {/* Deactivate Modal */}
      <DeactivateModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={handleDeactivateConfirm}
        promoCode={promoCode}
        loading={deactivateLoading}
      />
    </div>
  );
};

export default PromoChecker;
