import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { preprocessImage } from './imageUtils';

export const useInjuryDetectionModel = () => {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadModel = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Wait for TensorFlow.js to be ready
      await tf.ready();

      // Try loading from IndexedDB first
      try {
        const savedModel = await tf.loadLayersModel('indexeddb://injury-detection-model');
        await savedModel.summary();  // Verify model is valid
        setModel(savedModel);
        return;
      } catch (loadError) {
        console.log('Creating new model:', loadError.message);
      }

      // Create new model with improved architecture
      const newModel = tf.sequential();

      // Input layer with batch normalization
      newModel.add(tf.layers.conv2d({
        inputShape: [128, 128, 3],
        filters: 32,
        kernelSize: 3,
        activation: 'relu',
        padding: 'same'
      }));
      newModel.add(tf.layers.batchNormalization());
      newModel.add(tf.layers.maxPooling2d({ poolSize: 2 }));

      // Second convolutional block
      newModel.add(tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: 'relu',
        padding: 'same'
      }));
      newModel.add(tf.layers.batchNormalization());
      newModel.add(tf.layers.maxPooling2d({ poolSize: 2 }));

      // Third convolutional block
      newModel.add(tf.layers.conv2d({
        filters: 128,
        kernelSize: 3,
        activation: 'relu',
        padding: 'same'
      }));
      newModel.add(tf.layers.batchNormalization());
      newModel.add(tf.layers.maxPooling2d({ poolSize: 2 }));

      // Dense layers
      newModel.add(tf.layers.flatten());
      newModel.add(tf.layers.dense({ units: 128, activation: 'relu' }));
      newModel.add(tf.layers.dropout({ rate: 0.5 }));
      newModel.add(tf.layers.dense({ units: 64, activation: 'relu' }));
      newModel.add(tf.layers.dropout({ rate: 0.3 }));
      newModel.add(tf.layers.dense({ units: 4, activation: 'softmax' }));

      // Compile model with improved optimizer settings
      newModel.compile({
        optimizer: tf.train.adam(0.0001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
      });

      // Save model to IndexedDB
      await newModel.save('indexeddb://injury-detection-model');
      setModel(newModel);
    } catch (err) {
      console.error('Error initializing model:', err);
      setError(err.message);
      // Attempt cleanup of any failed model
      if (model) {
        try {
          model.dispose();
        } catch (cleanupError) {
          console.error('Model cleanup error:', cleanupError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load model on component mount
  useEffect(() => {
    loadModel();

    // Cleanup function
    return () => {
      if (model) {
        try {
          model.dispose();
        } catch (error) {
          console.error('Model disposal error:', error);
        }
      }
    };
  }, [loadModel]);

  const classifyImage = async (imageElement) => {
    if (!model) {
      throw new Error('Model not initialized');
    }

    let tensor = null;
    try {
      // Preprocess image and get prediction
      tensor = preprocessImage(imageElement);
      if (!tensor) {
        throw new Error('Failed to preprocess image');
      }

      const predictions = await model.predict(tensor).data();
      return Array.from(predictions);
    } catch (error) {
      console.error('Classification error:', error);
      throw new Error(`Failed to analyze image: ${error.message}`);
    } finally {
      // Cleanup tensor
      if (tensor) {
        try {
          tensor.dispose();
        } catch (cleanupError) {
          console.error('Tensor cleanup error:', cleanupError);
        }
      }
    }
  };

  return {
    model,
    isLoading,
    error,
    classifyImage
  };
};

export default useInjuryDetectionModel;