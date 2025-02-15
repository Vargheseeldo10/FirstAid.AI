import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, AlertTriangle, Check } from 'lucide-react';
import { useInjuryDetectionModel } from '../components/useInjuryDetectionModel';
import { useInjuryClassification } from '../components/InjuryClassificationContext';
import { processWebcamCapture, preprocessImage } from '../components/imageUtils';

function InjuryDetection() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [stream, setStream] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { model, isLoading: isModelLoading, classifyImage } = useInjuryDetectionModel();
  const { getInjuryClassification } = useInjuryClassification();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        const imageLoadPromise = new Promise((resolve, reject) => {
          reader.onload = resolve;
          reader.onerror = reject;
        });

        reader.readAsDataURL(file);
        const event = await imageLoadPromise;

        // Validate image dimensions and format
        const img = new Image();
        const imgLoadPromise = new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        img.src = event.target.result;
        await imgLoadPromise;

        if (img.width === 0 || img.height === 0) {
          throw new Error('Invalid image dimensions');
        }

        setImage(event.target.result);
        setPrediction(null);
        setCameraError(null);
      } catch (error) {
        console.error('Image upload error:', error);
        setCameraError('Failed to load image. Please try another image.');
      }
    }
  };

  const startCamera = async () => {
    setCameraError(null);

    // Ensure videoRef is initialized
    if (!videoRef.current) {
      throw new Error('Video element not initialized. Please ensure the video element is rendered.');
    }

    // First, clean up any existing stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Start with basic constraints
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      };

      let newStream;
      try {
        // First try with ideal constraints
        newStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (initialError) {
        console.warn('Failed with ideal constraints, trying fallback:', initialError);
        // Fallback to basic video constraints
        newStream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
      }

      if (!newStream || !newStream.getVideoTracks().length) {
        throw new Error('No video track available in media stream');
      }

      // Set up video element
      videoRef.current.srcObject = newStream;
      videoRef.current.setAttribute('playsinline', true);
      videoRef.current.setAttribute('autoplay', true);

      // Wait for video metadata to load
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Video metadata load timeout'));
        }, 5000);

        videoRef.current.onloadedmetadata = () => {
          clearTimeout(timeoutId);
          resolve();
        };
      });

      // Explicitly set video dimensions
      const videoTrack = newStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      if (settings.width && settings.height) {
        videoRef.current.width = settings.width;
        videoRef.current.height = settings.height;
      }

      // Ensure video starts playing
      try {
        await videoRef.current.play();
      } catch (playError) {
        throw new Error(`Failed to play video: ${playError.message}`);
      }

      setStream(newStream);
      setIsUsingCamera(true);
      setCameraError(null);
    } catch (error) {
      handleCameraError(error);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setCameraError('Camera initialization failed');
      return;
    }

    try {
      const result = await processWebcamCapture(videoRef.current, canvasRef.current);

      // Ensure the captured image is valid
      const img = new Image();
      const imageLoadPromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      img.src = result.src;
      await imageLoadPromise;

      if (img.width === 0 || img.height === 0) {
        throw new Error('Invalid captured image dimensions');
      }

      setImage(result.src);
      stopCamera();
    } catch (error) {
      console.error('Image capture error:', error);
      setCameraError('Failed to capture image. Please try again.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (error) {
          console.error('Error stopping track:', error);
        }
      });
      setStream(null);
    }

    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null;
      } catch (error) {
        console.error('Error clearing video source:', error);
      }
    }

    setIsUsingCamera(false);
  };

  const analyzeImage = async () => {
    if (!model || !image) {
      setCameraError('Model not ready or no image selected');
      return;
    }

    setIsLoading(true);
    setCameraError(null);

    try {
      const img = new Image();
      const imageLoadPromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      img.src = image;
      await imageLoadPromise;

      // Validate image before processing
      if (img.width === 0 || img.height === 0) {
        throw new Error('Invalid image dimensions');
      }

      const predictionData = await classifyImage(img);

      if (!predictionData || !Array.isArray(predictionData)) {
        throw new Error('Invalid prediction data received');
      }

      const maxIndex = predictionData.indexOf(Math.max(...predictionData));
      const classificationResult = getInjuryClassification(maxIndex);

      setPrediction(classificationResult);
    } catch (error) {
      console.error('Image analysis error:', error);
      setCameraError('Image analysis failed. Please try again with a different image.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      // Clear any remaining error states
      setCameraError(null);
      setIsUsingCamera(false);
    };
  }, []);

  // Additional cleanup on component unmount
  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Injury Detection</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {cameraError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center">
              <AlertTriangle className="mr-2" size={20} />
              <span>{cameraError}</span>
            </div>
          )}

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isModelLoading}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={20} /> Upload Image
            </button>
            <button
              onClick={isUsingCamera ? captureImage : startCamera}
              disabled={isLoading || isModelLoading}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera size={20} /> {isUsingCamera ? 'Capture' : 'Use Camera'}
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <canvas ref={canvasRef} className="hidden" />

          <div className="relative aspect-video mb-6 bg-gray-100 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${isUsingCamera ? 'block' : 'hidden'}`}
              playsInline
              autoPlay
              muted
              style={{
                transform: 'scaleX(-1)', // Mirror the video for selfie view if needed
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            />
            {!isUsingCamera && image && (
              <img
                src={image}
                alt="Uploaded injury"
                className="w-full h-full object-cover"
              />
            )}
            {!isUsingCamera && !image && (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">No image selected</p>
              </div>
            )}
          </div>

          {image && !isUsingCamera && (
            <button
              onClick={analyzeImage}
              disabled={isLoading || isModelLoading}
              className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Image'}
            </button>
          )}

          {prediction && (
            <div className={`mt-6 p-4 bg-${prediction.color}-50 rounded-lg border border-${prediction.color}-200`}>
              <h3 className="font-semibold mb-2 flex items-center">
                {prediction.severity === 'high' ? (
                  <AlertTriangle className="mr-2 text-red-600" />
                ) : (
                  <Check className="mr-2 text-green-600" />
                )}
                Analysis Results
              </h3>
              <p className="mb-2"><strong>Detected:</strong> {prediction.label}</p>
              <p className="mb-2"><strong>Severity:</strong> {prediction.severity}</p>
              <div className="mt-4 font-medium">
                <h4>Recommended Precautions:</h4>
                <ul className="list-disc list-inside mt-2">
                  {prediction.precautions.map((precaution, index) => (
                    <li key={index} className="mb-1">{precaution}</li>
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