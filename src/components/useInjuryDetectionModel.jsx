import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { preprocessImage } from './imageUtils';

export const useInjuryDetectionModel = () => {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadModel() {
      try {
        setIsLoading(true);

        // Attempt to load model from IndexedDB first
        try {
          const savedModel = await tf.loadLayersModel('indexeddb://injury-detection-model');
          setModel(savedModel);
          setIsLoading(false);
          return;
        } catch (loadError) {
          console.log('No saved model found, creating new model');
        }

        // Create model architecture
        const newModel = tf.sequential();

        newModel.add(tf.layers.conv2d({
          inputShape: [224, 224, 3],
          filters: 32,
          kernelSize: 3,
          activation: 'relu',
          padding: 'same'
        }));
        newModel.add(tf.layers.maxPooling2d({ poolSize: 2 }));

        newModel.add(tf.layers.conv2d({
          filters: 64,
          kernelSize: 3,
          activation: 'relu',
          padding: 'same'
        }));
        newModel.add(tf.layers.maxPooling2d({ poolSize: 2 }));

        newModel.add(tf.layers.flatten());
        newModel.add(tf.layers.dense({ units: 64, activation: 'relu' }));
        newModel.add(tf.layers.dropout({ rate: 0.5 }));
        newModel.add(tf.layers.dense({ units: 4, activation: 'softmax' }));

        // Compile the model
        newModel.compile({
          optimizer: tf.train.adam(0.001),
          loss: 'categoricalCrossentropy',
          metrics: ['accuracy'],
        });

        // Save newly created model to IndexedDB
        await newModel.save('indexeddb://injury-detection-model');
        setModel(newModel);
        setError(null);
      } catch (err) {
        console.error('Error loading model:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadModel();

    return () => {
      if (model) {
        model.dispose();
      }
    };
  }, []);

  const classifyImage = async (imageElement) => {
    if (!model) throw new Error('Model not loaded');

    try {
      const tensor = preprocessImage(imageElement);
      const predictions = await model.predict(tensor).data();
      tensor.dispose();

      return Array.from(predictions);
    } catch (err) {
      console.error('Error classifying image:', err);
      throw err;
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