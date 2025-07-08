import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import FeedbackList from './FeedbackList';

function ResultsDisplay({ results, onReset }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

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
        Analysis Results
      </h2>
      
      {/* Annotated Image */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Annotated Image
        </h3>
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
          <h3 className="text-lg font-semibold text-gray-800">
            Feedback & Corrections
          </h3>
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
        <FeedbackList feedback={results.feedback} />
      </div>

      {/* New Analysis Button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="btn-secondary flex items-center mx-auto"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start New Analysis
        </button>
      </div>
    </div>
  );
}

export default ResultsDisplay; 