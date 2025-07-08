import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, Send, RotateCcw, Volume2, VolumeX } from 'lucide-react';

function FileUpload({ onFileUpload, onError }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-invalid-type') {
        onError('Please select a valid PNG image file');
      } else if (rejection.errors[0].code === 'file-too-large') {
        onError('File size must be less than 10MB');
      } else {
        onError('File upload failed. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const analyzeImage = async () => {
    if (!selectedFile) {
      onError('Please select a PNG image first');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      onError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setResults(null);
    onFileUpload(null);
  };

  const speakFeedback = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (!results?.feedback || results.feedback.length === 0) return;
    let fullText = 'Analysis Results: ';
    results.feedback.forEach((item, index) => {
      const text = typeof item === 'string' ? item : item.message;
      fullText += `${index + 1}. ${text}. `;
    });
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Upload Handwriting Sample (PNG Only)
      </h2>
      
      {!selectedFile && !results && (
        <div
          {...getRootProps()}
          className={`upload-area ${isDragActive ? 'dragover' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="mb-4">
            {isDragActive ? (
              <FileImage className="mx-auto h-12 w-12 text-blue-500" />
            ) : (
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
            )}
          </div>
          <p className="text-lg text-gray-600 mb-2">
            {isDragActive ? 'Drop the PNG image here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm text-gray-500">
            PNG images only, up to 10MB
          </p>
        </div>
      )}

      {selectedFile && !results && (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Preview
          </h3>
          <div className="relative inline-block">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Handwriting preview"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
            <button
              onClick={resetUpload}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
          <button
            onClick={analyzeImage}
            disabled={isAnalyzing}
            className="btn-primary mt-4 flex items-center mx-auto"
          >
            {isAnalyzing ? (
              <>
                <div className="spinner w-4 h-4 mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Analyze with FastAPI
              </>
            )}
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="text-center py-8">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Analyzing your handwriting...</p>
          <p className="text-sm text-gray-500 mt-2">Sending to FastAPI backend</p>
        </div>
      )}

      {results && (
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Analysis Results
          </h3>
          {/* Annotated Image */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Annotated Image
            </h4>
            <div className="text-center">
              {results.annotated_image && (
                <img
                  src={`data:image/jpeg;base64,${results.annotated_image}`}
                  alt="Annotated handwriting"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              )}
            </div>
          </div>
          {/* Feedback Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-800">
                Feedback & Corrections
              </h4>
              {window.speechSynthesis && results.feedback && results.feedback.length > 0 && (
                <button
                  onClick={speakFeedback}
                  className="btn-success flex items-center"
                >
                  {isSpeaking ? (
                    <VolumeX className="w-4 h-4 mr-2" />
                  ) : (
                    <Volume2 className="w-4 h-4 mr-2" />
                  )}
                  {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {results.feedback && results.feedback.length > 0 ? (
                results.feedback.map((item, index) => {
                  const message = typeof item === 'string' ? item : item.message;
                  return (
                    <div key={index} className="feedback-item">
                      <div className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        <span>{message}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="feedback-item success">
                  <div className="flex items-center">
                    <span className="text-green-300 mr-2">✓</span>
                    <span>No issues detected in your handwriting!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Reset Button */}
          <div className="text-center">
            <button
              onClick={resetUpload}
              className="btn-secondary flex items-center mx-auto"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Upload New Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload; 