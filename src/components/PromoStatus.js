import React, { useState } from 'react';
import { promoAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Info
} from 'lucide-react';

const PromoStatus = () => {
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    setLoading(true);
    setStatusData(null);
    setError(null);

    try {
      const response = await promoAPI.checkStatus(promoCode.trim());
      setStatusData(response.data.status);
      toast.success('Status retrieved successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to check promo code status';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'valid':
        return <CheckCircle size={24} className="text-green-500" />;
      case 'expired':
      case 'inactive':
        return <XCircle size={24} className="text-red-500" />;
      case 'pending':
        return <Clock size={24} className="text-yellow-500" />;
      default:
        return <AlertCircle size={24} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'valid':
        return 'text-green-700 bg-green-100';
      case 'expired':
      case 'inactive':
        return 'text-red-700 bg-red-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Проверить статус промо-кода</h1>
        <p className="mt-1 text-sm text-gray-500">
          Verify the status and details of a promo code
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Check Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Введите промо-код</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
                Промо-код *
              </label>
              <input
                type="text"
                id="promoCode"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="form-input"
                placeholder="Введите промо-код для проверки статуса"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !promoCode.trim()}
              className="w-full btn btn-primary"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Проверка статуса...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Проверить статус
                </>
              )}
            </button>
          </form>
        </div>

        {/* Status Results */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Информация о статусе</h2>
          
          {statusData ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(statusData.status)}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Статус</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(statusData.status)}`}>
                    {statusData.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Код:</span>
                  <span className="text-sm font-mono text-gray-900">{statusData.code}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Type:</span>
                  <span className="text-sm text-gray-900 capitalize">{statusData.type}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Value:</span>
                  <span className="text-sm text-gray-900">
                    {statusData.value}
                    {statusData.type === 'percentage' ? '%' : '$'}
                  </span>
                </div>
                
                {statusData.expiryDate && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-500">Expires:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(statusData.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {statusData.description && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-500">Description:</span>
                    <span className="text-sm text-gray-900">{statusData.description}</span>
                  </div>
                )}
                
                {statusData.createdAt && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-500">Created:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(statusData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {statusData.usageCount !== undefined && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-500">Usage Count:</span>
                    <span className="text-sm text-gray-900">{statusData.usageCount}</span>
                  </div>
                )}
                
                {statusData.maxUsage && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-500">Max Usage:</span>
                    <span className="text-sm text-gray-900">{statusData.maxUsage}</span>
                  </div>
                )}
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-error">
              <AlertCircle size={20} className="mr-2" />
              {error}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-lg p-8 mb-4">
                <Search size={48} className="mx-auto text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Статус не проверен
              </h3>
              <p className="text-sm text-gray-500">
                Введите промо-код и нажмите "Проверить статус" для просмотра информации
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <Info size={20} className="text-blue-500 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-2">О проверке статуса</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Информация о статусе получается из внешнего API</li>
              <li>• This shows the current state of the promo code in the external system</li>
              <li>• Activation status is tracked separately in this application</li>
              <li>• Use the History page to see which codes have been activated locally</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoStatus;
