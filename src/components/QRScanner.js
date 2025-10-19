import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';

const QRScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera if available
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // Simple QR code detection simulation
    // In a real implementation, you would use a QR code library like jsQR
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // For demo purposes, we'll simulate QR detection
    // In production, use a proper QR code library
    setTimeout(() => {
      // Simulate finding a QR code
      const mockQRCode = 'DEMO-PROMO-123';
      onScan(mockQRCode);
    }, 1000);
  };

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(captureFrame, 1000);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 bg-gray-200 rounded-lg"
          />
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          
          {/* Scanning overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Position the QR code within the frame
          </p>
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Simulate manual input
              const manualCode = prompt('Enter promo code manually:');
              if (manualCode) {
                onScan(manualCode);
              }
            }}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Manual Input
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
