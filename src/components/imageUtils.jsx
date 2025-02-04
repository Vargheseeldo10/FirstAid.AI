import * as tf from '@tensorflow/tfjs';

export const preprocessImage = (imageElement) => {
  try {
    return tf.tidy(() => {
      return tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255))
        .expandDims();
    });
  } catch (error) {
    console.error('Image preprocessing error:', error);
    return null;
  }
};

export const processWebcamCapture = (videoElement, canvasElement) => {
  if (!canvasElement) {
    canvasElement = document.createElement('canvas');
  }
  
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  const context = canvasElement.getContext('2d');
  context.drawImage(videoElement, 0, 0);

  const imageElement = new Image();
  imageElement.src = canvasElement.toDataURL('image/jpeg');

  return new Promise((resolve, reject) => {
    imageElement.onload = () => resolve({ src: imageElement.src, element: imageElement });
    imageElement.onerror = reject;
  });
};

export const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};