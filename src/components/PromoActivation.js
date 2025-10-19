import React, { useState, useRef } from 'react';
import { promoAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  QrCode, 
  Camera, 
  Type, 
  CheckCircle, 
  AlertCircle,
  X
} from 'lucide-react';

const PromoActivation = () => {
  const [promoCode, setPromoCode] = useState('');
  const [customerInfo, setCustomerInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError('Не удается получить доступ к камере. Проверьте разрешения.');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
    setCameraError(null);
  };

  const captureAndScan = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // In a real implementation, you would use a QR code scanning library
    // For now, we'll simulate the scanning process
    setTimeout(() => {
      // Simulate QR code detection
      const simulatedCode = `PROMO${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      setPromoCode(simulatedCode);
      stopCamera();
      toast.success('Промо-код успешно отсканирован!');
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!promoCode.trim()) {
      toast.error('Please enter or scan a promo code');
      return;
    }

    setLoading(true);
    try {
      const response = await promoAPI.activate({
        promoCode: promoCode.trim(),
        customerInfo: customerInfo.trim() || null,
        notes: notes.trim() || null
      });

      toast.success('Промо-код успешно активирован!');
      
      // Reset form
      setPromoCode('');
      setCustomerInfo('');
      setNotes('');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to activate promo code';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Активировать промо-код</h1>
        <p className="mt-1 text-sm text-gray-500">
          Введите или отсканируйте промо-код для его активации
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activation Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Activation Form</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Promo Code Input */}
            <div>
              <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
                Промо-код *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="promoCode"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 form-input"
                  placeholder="Введите промо-код или отсканируйте QR-код"
                  required
                />
                <button
                  type="button"
                  onClick={scanning ? stopCamera : startCamera}
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    scanning 
                      ? 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200' 
                      : 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'
                  }`}
                >
                  {scanning ? <X size={20} /> : <Camera size={20} />}
                </button>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <label htmlFor="customerInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Information (Optional)
              </label>
              <input
                type="text"
                id="customerInfo"
                value={customerInfo}
                onChange={(e) => setCustomerInfo(e.target.value)}
                className="form-input"
                placeholder="Customer name, phone, email, etc."
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-textarea"
                placeholder="Additional notes about this activation"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !promoCode.trim()}
              className="w-full btn btn-success"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Activating...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Активировать промо-код
                </>
              )}
            </button>
          </form>
        </div>

        {/* Camera Scanner */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">QR-код сканер</h2>
          
          {scanning ? (
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-blue-500 rounded-lg p-4 bg-white bg-opacity-90">
                    <QrCode size={48} className="text-blue-500" />
                  </div>
                </div>
              </div>
              
              {cameraError ? (
                <div className="alert alert-error">
                  <AlertCircle size={20} className="mr-2" />
                  {cameraError}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Поместите QR-код в рамку
                  </p>
                  <button
                    onClick={captureAndScan}
                    className="btn btn-primary"
                  >
                    <Camera size={20} />
                    Захватить и сканировать
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-lg p-8 mb-4">
                <Camera size={48} className="mx-auto text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Готов к сканированию
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Нажмите кнопку камеры для начала сканирования QR-кодов
              </p>
              <button
                onClick={startCamera}
                className="btn btn-primary"
              >
                <Camera size={20} />
                Запустить камеру
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Instructions</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Введите промо-код вручную или используйте камеру для сканирования QR-кода</li>
          <li>• Each promo code can only be activated once</li>
          <li>• Customer information and notes are optional but recommended for tracking</li>
          <li>• Убедитесь, что у вас включены разрешения камеры для сканирования QR-кодов</li>
        </ul>
      </div>
    </div>
  );
};

export default PromoActivation;
