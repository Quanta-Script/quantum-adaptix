import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AIModel = () => {
  const [input, setInput] = useState('');
  const [prediction, setPrediction] = useState('');

  const makePrediction = () => {
    // Simulating an AI prediction
    const sentimentScore = Math.random();
    const sentiment = sentimentScore > 0.5 ? 'Positive' : 'Negative';
    setPrediction(`Sentiment: ${sentiment} (Score: ${sentimentScore.toFixed(2)})`);
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