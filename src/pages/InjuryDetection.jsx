import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Camera, AlertTriangle, Check } from 'lucide-react';
import { useInjuryDetectionModel } from '../components/useInjuryDetectionModel';
import { useInjuryClassification } from '../components/InjuryClassificationContext';
import { processWebcamCapture } from '../components/imageUtils';

function InjuryDetection() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [hasCameraSupport, setHasCameraSupport] = useState(null);
  const [isVideoElementReady, setIsVideoElementReady] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const { model, isLoading: isModelLoading, classifyImage } = useInjuryDetectionModel();
  const { getInjuryClassification } = useInjuryClassification();

  const setVideoRef = useCallback(node => {
    videoRef.current = node;
    setIsVideoElementReady(!!node);
  }, []);

  // Check for camera support on component mount
  useEffect(() => {
    const checkCameraSupport = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        setHasCameraSupport(hasCamera);
      } catch (error) {
        console.error('Error checking camera support:', error);
        setHasCameraSupport(false);
      }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      checkCameraSupport();
    } else {
      setHasCameraSupport(false);
    }
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setPrediction(null);
        setCameraError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    // Reset any previous errors
    setCameraError(null);
    
    // Check for camera support
    if (!hasCameraSupport) {
      setCameraError('No camera detected on this device');
      return;
    }

    // Check if video element is ready
    if (!isVideoElementReady) {
      setCameraError('Camera initialization in progress. Please try again.');
      return;
    }

    // Stop any existing stream
    await stopCamera();

    try {
      // Request camera access with fallback options
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      }).catch(async () => {
        // Fallback to any available video device
        return navigator.mediaDevices.getUserMedia({
          video: true
        });
      });

      // Double check video element is still available
      if (!videoRef.current) {
        stream.getTracks().forEach(track => track.stop());
        throw new Error('Video element not available');
      }

      // Store stream reference
      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Video load timeout'));
        }, 10000); // 10 second timeout

        const handleLoadedMetadata = () => {
          clearTimeout(timeoutId);
          if (videoRef.current) {
            videoRef.current.play()
              .then(resolve)
              .catch(reject);
          } else {
            reject(new Error('Video element not available'));
          }
        };

        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
      });

      setIsUsingCamera(true);
    } catch (error) {
      handleCameraError(error);
    }
  };

  const handleCameraError = (error) => {
    console.error('Camera access error:', error);
    const errorMap = {
      NotAllowedError: 'Camera access denied. Please grant camera permissions.',
      NotFoundError: 'No camera found on this device.',
      NotReadableError: 'Camera is in use by another application.',
      OverconstrainedError: 'Camera does not meet the required constraints.',
      TypeError: 'Camera initialization failed.',
      AbortError: 'Camera access was aborted.'
    };
    
    setCameraError(errorMap[error.name] || `Camera access failed: ${error.message}`);
    setIsUsingCamera(false);
    stopCamera();
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setCameraError('Camera components not initialized');
      return;
    }

    try {
      const result = await processWebcamCapture(
        videoRef.current, 
        canvasRef.current
      );
      
      setImage(result.src);
      await stopCamera();
    } catch (error) {
      console.error('Image capture error:', error);
      setCameraError('Failed to capture image');
    }
  };

  const stopCamera = async () => {
    setIsUsingCamera(false);
    
    // Stop all tracks in the current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const analyzeImage = async () => {
    if (!model || !image) return;

    setIsLoading(true);
    try {
      const img = new Image();
      img.src = image;
      await new Promise(resolve => { img.onload = resolve; });

      const predictionData = await classifyImage(img);
      const maxIndex = predictionData.indexOf(Math.max(...predictionData));
      const classificationResult = getInjuryClassification(maxIndex);
      
      setPrediction(classificationResult);
    } catch (error) {
      console.error('Image analysis error:', error);
      setCameraError('Image analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Injury Detection</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {cameraError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {cameraError}
            </div>
          )}

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              <Upload size={20} /> Upload Image
            </button>
            {hasCameraSupport && (
              <button
                onClick={isUsingCamera ? captureImage : startCamera}
                disabled={isModelLoading || !isVideoElementReady}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                <Camera size={20} />
                {isModelLoading 
                  ? 'Loading...' 
                  : isUsingCamera 
                    ? 'Capture' 
                    : 'Use Camera'
                }
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <canvas ref={canvasRef} className="hidden" />

          <div className="relative aspect-video mb-6">
            {/* Always render video element but hide when not in use */}
            <video
              ref={setVideoRef}
              className={`absolute inset-0 w-full h-full object-cover rounded-lg ${!isUsingCamera && 'hidden'}`}
              playsInline
              muted
              autoPlay
            />

            {!isUsingCamera && (
              <div className="relative w-full h-full">
                {image ? (
                  <img
                    src={image}
                    alt="Uploaded injury"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">No image selected</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {image && !isUsingCamera && (
            <button
              onClick={analyzeImage}
              disabled={isLoading || isModelLoading}
              className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 disabled:opacity-50"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Image'}
            </button>
          )}

          {prediction && (
            <div className={`mt-6 p-4 bg-${prediction.color}-50 rounded-lg`}>
              <h3 className="font-semibold mb-2 flex items-center">
                {prediction.severity === 'high' ? (
                  <AlertTriangle className="mr-2 text-red-600" />
                ) : (
                  <Check className="mr-2 text-green-600" />
                )}
                Analysis Results
              </h3>
              <p className="mb-2"><strong>Detected:</strong> {prediction.label}</p>
              <div className="mt-4 font-medium">
                <h4>Recommended Precautions:</h4>
                <ul className="list-disc list-inside">
                  {prediction.precautions.map((precaution, index) => (
                    <li key={index}>{precaution}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InjuryDetection;