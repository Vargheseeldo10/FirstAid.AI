import * as tf from '@tensorflow/tfjs';

export const preprocessImage = (imageElement) => {
  if (!imageElement || !imageElement.complete || !imageElement.naturalHeight) {
    throw new Error('Invalid image element');
  }

  return tf.tidy(() => {
    // Convert image to tensor
    const tensor = tf.browser.fromPixels(imageElement);

    // Check tensor dimensions
    if (tensor.shape[0] === 0 || tensor.shape[1] === 0) {
      tensor.dispose();
      throw new Error('Invalid image dimensions');
    }

    // Resize to 128x128 to match model's expected input shape
    return tensor
      .resizeNearestNeighbor([224, 224])  // Changed from 224x224 to 128x128
      .toFloat()
      .div(tf.scalar(255))
      .expandDims();
  });
};

export const processWebcamCapture = (videoElement, canvasElement) => {
  return new Promise((resolve, reject) => {
    if (!videoElement || !videoElement.videoWidth || !videoElement.videoHeight) {
      reject(new Error('Invalid video element'));
      return;
    }

    if (!canvasElement) {
      reject(new Error('Canvas element is required'));
      return;
    }

    try {
      // Set canvas dimensions to match video
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      const context = canvasElement.getContext('2d');
      if (!context) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Draw video frame to canvas
      context.drawImage(videoElement, 0, 0);

      // Convert to image
      const imageDataUrl = canvasElement.toDataURL('image/jpeg', 0.9);
      const imageElement = new Image();

      imageElement.onload = () => {
        if (imageElement.width === 0 || imageElement.height === 0) {
          reject(new Error('Invalid captured image dimensions'));
          return;
        }
        resolve({ src: imageDataUrl, element: imageElement });
      };

      imageElement.onerror = () => {
        reject(new Error('Failed to load captured image'));
      };

      imageElement.src = imageDataUrl;
    } catch (error) {
      reject(new Error(`Capture processing failed: ${error.message}`));
    }
  });
};