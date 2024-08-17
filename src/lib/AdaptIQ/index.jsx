import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const UserAuth = lazy(() => import('./UserAuth'));
const DynamicTuning = lazy(() => import('./DynamicTuning'));
const ContextManager = lazy(() => import('./ContextManager'));
const DataManager = lazy(() => import('./DataManager'));
const QuantumSimulator = lazy(() => import('./QuantumSimulator'));
const AIModel = lazy(() => import('./AIModel'));
const EthicsCompliance = lazy(() => import('./EthicsCompliance'));

const ErrorFallback = ({ error }) => (
  <div className="text-red-500">
    <h2>Something went wrong:</h2>
    <pre>{error.message}</pre>
  </div>
);

const AdaptIQ = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">AdaptIQ System</h1>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Suspense fallback={<div>Loading User Authentication...</div>}>
            <UserAuth />
          </Suspense>
          <Suspense fallback={<div>Loading Dynamic Tuning...</div>}>
            <DynamicTuning />
          </Suspense>
          <Suspense fallback={<div>Loading Context Manager...</div>}>
            <ContextManager />
          </Suspense>
          <Suspense fallback={<div>Loading Data Manager...</div>}>
            <DataManager />
          </Suspense>
          <Suspense fallback={<div>Loading Quantum Simulator...</div>}>
            <QuantumSimulator />
          </Suspense>
          <Suspense fallback={<div>Loading AI Model...</div>}>
            <AIModel />
          </Suspense>
          <Suspense fallback={<div>Loading Ethics Compliance...</div>}>
            <EthicsCompliance />
          </Suspense>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default AdaptIQ;