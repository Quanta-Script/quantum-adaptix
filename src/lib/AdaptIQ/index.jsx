import React from 'react';
import UserAuth from './UserAuth';
import DynamicTuning from './DynamicTuning';
import ContextManager from './ContextManager';
import DataManager from './DataManager';
import QuantumSimulator from './QuantumSimulator';
import AIModel from './AIModel';
import EthicsCompliance from './EthicsCompliance';

const AdaptIQ = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">AdaptIQ System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserAuth />
        <DynamicTuning />
        <ContextManager />
        <DataManager />
        <QuantumSimulator />
        <AIModel />
        <EthicsCompliance />
      </div>
    </div>
  );
};

export default AdaptIQ;