import React, { useState } from 'react';
import { promoAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Percent
} from 'lucide-react';

const PromoGeneration = () => {
  const [formData, setFormData] = useState({
    value: '',
    type: 'percentage',
    expiryDate: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedCode(null);

    try {
      const response = await promoAPI.generate({
        value: parseFloat(formData.value),
        type: formData.type,
        expiryDate: formData.expiryDate || null,
        description: formData.description || null
      });

      setGeneratedCode(response.data.promoCode);
      toast.success('Promo code generated successfully!');
      
      // Reset form
      setFormData({
        value: '',
        type: 'percentage',
        expiryDate: '',
        description: ''
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to generate promo code';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Создать промо-код</h1>
        <p className="mt-1 text-sm text-gray-500">
          Создайте новый промо-код с помощью внешнего API
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generation Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Promo Code Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Value */}
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                Значение *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.type === 'percentage' ? (
                    <Percent className="h-5 w-5 text-gray-400" />
                  ) : (
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder={formData.type === 'percentage' ? '10' : '5.00'}
                  min="0"
                  step={formData.type === 'percentage' ? '1' : '0.01'}
                  required
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Тип *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Amount Discount</option>
              </select>
            </div>

            {/* Expiry Date */}
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                Дата истечения (необязательно)
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="form-input"
                min={getMinDate()}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Описание (необязательно)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Brief description of this promo code"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.value}
              className="w-full btn btn-primary"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Создать промо-код
                </>
              )}
            </button>
          </form>
        </div>

        {/* Generated Code Display */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Созданный код</h2>
          
          {generatedCode ? (
            <div className="space-y-4">
              <div className="alert alert-success">
                <CheckCircle size={20} className="mr-2" />
                Promo code generated successfully!
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Promo Code:</span>
                  <button
                    onClick={() => copyToClipboard(generatedCode.code)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-500"
                  >
                    {copied ? (
                      <>
                        <CheckCircle size={16} className="mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-lg font-bold text-gray-900 break-all">
                  {generatedCode.code}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Тип:</span>
                  <span className="font-medium capitalize">{generatedCode.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Значение:</span>
                  <span className="font-medium">
                    {generatedCode.value}
                    {generatedCode.type === 'percentage' ? '%' : '$'}
                  </span>
                </div>
                {generatedCode.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expires:</span>
                    <span className="font-medium">
                      {new Date(generatedCode.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {generatedCode.description && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Описание:</span>
                    <span className="font-medium">{generatedCode.description}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-lg p-8 mb-4">
                <Plus size={48} className="mx-auto text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Код не создан
              </h3>
              <p className="text-sm text-gray-500">
                Заполните форму и нажмите "Создать промо-код" для создания нового кода
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Information</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Promo codes are generated via external API</li>
          <li>• Percentage discounts are applied to the total amount</li>
          <li>• Fixed amount discounts are subtracted from the total</li>
          <li>• Дата истечения необязательна - коды без даты истечения никогда не истекают</li>
          <li>• Созданные коды можно активировать через интерфейс активации</li>
        </ul>
      </div>
    </div>
  );
};

export default PromoGeneration;
