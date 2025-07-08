import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Header from './components/Header';

function App() {
  const [error, setError] = useState(null);

  const handleFileUpload = (file) => {
    // This function is now handled internally by FileUpload component
    // We keep it for compatibility but it's not used
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        
        <div className="card mb-6">
          <FileUpload onFileUpload={handleFileUpload} onError={showError} />
        </div>

        {/* Error Notification */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideIn">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Powered by AI • Designed for accessibility</p>
        </div>
      </div>
    </div>
  );
}

export default App; 