// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const removeImage = document.getElementById('removeImage');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const annotatedImage = document.getElementById('annotatedImage');
const feedbackList = document.getElementById('feedbackList');
const speakBtn = document.getElementById('speakBtn');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');

// State
let currentFile = null;
let speechSynthesis = window.speechSynthesis;

// Event Listeners
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
removeImage.addEventListener('click', removeCurrentImage);
analyzeBtn.addEventListener('click', analyzeHandwriting);
speakBtn.addEventListener('click', speakFeedback);
newAnalysisBtn.addEventListener('click', resetToUpload);

// File Upload Handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        showError('Please select a valid image file (JPG or PNG)');
        return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showError('File size must be less than 10MB');
        return;
    }

    currentFile = file;
    displayPreview(file);
}

function displayPreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewSection.classList.remove('hidden');
        uploadArea.classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

function removeCurrentImage() {
    currentFile = null;
    fileInput.value = '';
    previewSection.classList.add('hidden');
    uploadArea.classList.remove('hidden');
}

// Analysis Handlers
async function analyzeHandwriting() {
    if (!currentFile) {
        showError('Please select an image first');
        return;
    }

    showLoading(true);
    
    try {
        const formData = new FormData();
        formData.append('file', currentFile);

        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        displayResults(result);
    } catch (error) {
        console.error('Analysis failed:', error);
        showError('Analysis failed. Please try again.');
    } finally {
        showLoading(false);
    }
}

function displayResults(result) {
    // Display annotated image
    if (result.annotated_image) {
        annotatedImage.src = `data:image/png;base64,${result.annotated_image}`;
    }

    // Display feedback
    feedbackList.innerHTML = '';
    if (result.feedback && result.feedback.length > 0) {
        result.feedback.forEach((item, index) => {
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'feedback-item';
            
            let feedbackText = '';
            if (item.reversed_letter && item.corrected_letter) {
                feedbackText = `Letter "${item.reversed_letter}" at position (${item.x}, ${item.y}) should be "${item.corrected_letter}"`;
            } else if (item.message) {
                feedbackText = item.message;
            } else {
                feedbackText = `Correction at position (${item.x}, ${item.y})`;
            }
            
            feedbackItem.innerHTML = `
                <div class="flex items-start">
                    <span class="text-yellow-300 mr-2">•</span>
                    <span>${feedbackText}</span>
                </div>
            `;
            feedbackList.appendChild(feedbackItem);
        });
    } else {
        const noFeedbackItem = document.createElement('div');
        noFeedbackItem.className = 'feedback-item bg-green-600';
        noFeedbackItem.innerHTML = `
            <div class="flex items-center">
                <span class="text-green-300 mr-2">✓</span>
                <span>Great handwriting! No corrections needed.</span>
            </div>
        `;
        feedbackList.appendChild(noFeedbackItem);
    }

    resultsSection.classList.remove('hidden');
}

// Speech Synthesis
function speakFeedback() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        speakBtn.innerHTML = `
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.794a1 1 0 011.617.794zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
            Read Aloud
        `;
        return;
    }

    const feedbackItems = feedbackList.querySelectorAll('.feedback-item');
    if (feedbackItems.length === 0) return;

    let fullText = 'Analysis Results: ';
    feedbackItems.forEach((item, index) => {
        const text = item.textContent.trim();
        fullText += `${index + 1}. ${text}. `;
    });

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
        speakBtn.innerHTML = `
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd"></path>
            </svg>
            Stop Reading
        `;
    };

    utterance.onend = () => {
        speakBtn.innerHTML = `
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.794a1 1 0 011.617.794zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
            Read Aloud
        `;
    };

    speechSynthesis.speak(utterance);
}

// UI State Management
function showLoading(show) {
    if (show) {
        loadingSection.classList.remove('hidden');
        previewSection.classList.add('hidden');
    } else {
        loadingSection.classList.add('hidden');
    }
}

function resetToUpload() {
    // Stop any ongoing speech
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }

    // Reset state
    currentFile = null;
    fileInput.value = '';

    // Reset UI
    uploadArea.classList.remove('hidden');
    previewSection.classList.add('hidden');
    loadingSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    
    // Reset button text
    speakBtn.innerHTML = `
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.794a1 1 0 011.617.794zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
        Read Aloud
    `;
}

function showError(message) {
    // Create a simple error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check if speech synthesis is supported
    if (!speechSynthesis) {
        speakBtn.style.display = 'none';
    }
});

