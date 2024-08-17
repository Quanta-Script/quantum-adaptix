import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as tf from '@tensorflow/tfjs';

const AIModel = () => {
  const [input, setInput] = useState('');
  const [prediction, setPrediction] = useState('');
  const [model, setModel] = useState(null);

  useEffect(() => {
    // Initialize a simple TensorFlow.js model for text classification
    const initModel = async () => {
      const m = tf.sequential();
      m.add(tf.layers.dense({ units: 16, inputShape: [10], activation: 'relu' }));
      m.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
      m.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });
      setModel(m);
    };
    initModel();
  }, []);

  const makePrediction = async () => {
    if (!model) return;

    // Convert input text to a simple numeric representation
    const inputTensor = tf.tensor2d([input.split('').map(char => char.charCodeAt(0) / 255).slice(0, 10)]);

    const prediction = model.predict(inputTensor);
    const score = prediction.dataSync()[0];
    setPrediction(`Sentiment: ${score > 0.5 ? 'Positive' : 'Negative'} (Score: ${score.toFixed(2)})`);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Advanced AI Model</h2>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text for sentiment analysis"
        className="mb-2"
      />
      <Button onClick={makePrediction} className="mb-2">Analyze</Button>
      {prediction && (
        <div>
          <h3 className="font-semibold">AI Prediction:</h3>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default AIModel;