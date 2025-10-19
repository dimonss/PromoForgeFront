import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import jsQR from 'jsqr';

const QRScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningStatus, setScanningStatus] = useState('Инициализация...');

  useEffect(() => {
    startCamera();
    
    // Emergency cleanup on page unload
    const handleBeforeUnload = () => {
      stopCamera();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      stopCamera();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const startCamera = async () => {
    try {
      setScanningStatus('Запуск камеры...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera if available
        } 
      });
      
      // Store stream reference for cleanup
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        setScanningStatus('Сканирование...');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Не удается получить доступ к камере. Проверьте разрешения.');
      setScanningStatus('Ошибка доступа к камере');
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    
    // Stop using streamRef if available
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        track.stop();
        console.log('Camera track stopped:', track.kind, track.label);
      });
      streamRef.current = null;
    }
    
    // Also stop using videoRef
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => {
        track.stop();
        console.log('Video track stopped:', track.kind, track.label);
      });
      videoRef.current.srcObject = null;
    }
    
    // Force stop all media tracks as last resort
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          stream.getTracks().forEach(track => track.stop());
          console.log('Emergency stop: All media tracks stopped');
        })
        .catch(() => {
          // Ignore errors, this is just emergency cleanup
        });
    }
    
    setIsScanning(false);
    setScanningStatus('Камера остановлена');
    console.log('Camera stopped successfully');
  };

  const handleClose = () => {
    console.log('Closing scanner modal...');
    stopCamera();
    
    // Double-check that camera is stopped
    setTimeout(() => {
      if (streamRef.current || (videoRef.current && videoRef.current.srcObject)) {
        console.warn('Camera still active, forcing stop...');
        stopCamera();
      }
    }, 100);
    
    onClose();
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Check if video is ready
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      // Get image data for QR code detection
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Use jsQR to detect QR codes
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        // QR code found!
        console.log('QR Code detected:', code.data);
        setScanningStatus('QR-код найден! Проверка...');
        onScan(code.data);
        
        // Add a small delay before stopping camera to show the status
        setTimeout(() => {
          console.log('Auto-stopping camera after QR detection...');
          stopCamera(); // Stop scanning after successful detection
        }, 500);
      }
    }
  };

  useEffect(() => {
    if (isScanning) {
      // Use requestAnimationFrame for smoother scanning
      let animationFrame;
      const scan = () => {
        captureFrame();
        animationFrame = requestAnimationFrame(scan);
      };
      scan();
      
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [isScanning]);

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Сканировать QR-код</h3>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative p-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover"
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-black rounded-lg relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-black"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-black"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-black"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-black"></div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <div className="flex items-center">
              <svg className="h-4 w-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="px-4 pb-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Поместите QR-код в рамку
          </p>
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <p className="text-xs text-gray-500">{scanningStatus}</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
