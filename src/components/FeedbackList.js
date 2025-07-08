import React from 'react';
import { CheckCircle } from 'lucide-react';

function FeedbackList({ feedback }) {
  if (!feedback || feedback.length === 0) {
    return (
      <div className="feedback-item success">
        <div className="flex items-center">
          <CheckCircle className="text-green-300 mr-2 w-5 h-5" />
          <span>Great handwriting! No corrections needed.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {feedback.map((item, index) => {
        let feedbackText = '';
        
        if (item.reversed_letter && item.corrected_letter) {
          feedbackText = `Letter "${item.reversed_letter}" at position (${item.x}, ${item.y}) should be "${item.corrected_letter}"`;
        } else if (item.message) {
          feedbackText = item.message;
        } else {
          feedbackText = `Correction at position (${item.x}, ${item.y})`;
        }

        return (
          <div key={index} className="feedback-item">
            <div className="flex items-start">
              <span className="text-yellow-300 mr-2">•</span>
              <span>{feedbackText}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FeedbackList; 