import React from 'react';

function LoadingSpinner() {
  return (
    <div className="text-center py-8">
      <div className="spinner mx-auto mb-4"></div>
      <p className="text-lg text-gray-600">Analyzing your handwriting...</p>
      <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
    </div>
  );
}

export default LoadingSpinner; 