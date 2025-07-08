# Dyslexia Handwriting Analysis Tool - React

A modern React-based web application for analyzing handwriting samples to help individuals with dyslexia improve their writing skills.

## Features

### 🖼️ File Upload
- **Drag & Drop Interface**: Intuitive drag-and-drop using react-dropzone
- **File Validation**: Accepts JPG and PNG images up to 10MB
- **Image Preview**: Shows uploaded image before analysis
- **Multiple Upload Methods**: Click to browse or drag files directly

### 🤖 Backend Integration
- **FastAPI Integration**: Sends images to `/predict` endpoint
- **FormData Upload**: Properly formatted multipart/form-data requests
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Visual feedback during analysis

### 📊 Result Display
- **Annotated Images**: Displays AI-annotated handwriting with corrections
- **Structured Feedback**: Lists specific corrections with coordinates
- **Visual Indicators**: Color-coded feedback items for easy identification
- **Responsive Layout**: Works seamlessly on desktop and mobile devices

### 🔊 Voice Option
- **Text-to-Speech**: Browser-based speech synthesis for feedback
- **Accessibility**: Helps users with reading difficulties
- **Play/Pause Control**: Start and stop speech playback
- **Clear Pronunciation**: Optimized speech settings for clarity

## Design Features

### 🎨 Dyslexia-Friendly Design
- **Open Sans Font**: High legibility font family
- **Increased Spacing**: Better letter and word spacing
- **High Contrast**: Clear text and background contrast
- **Soft Colors**: Pastel background with gentle gradients
- **Large Buttons**: Easy-to-click interface elements

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large touch targets for mobile devices
- **Flexible Layout**: Adapts to different viewport sizes
- **Progressive Enhancement**: Works without JavaScript

### ♿ Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Indicators**: Clear focus states for all interactive elements
- **High Contrast Mode**: Supports system high contrast preferences
- **Reduced Motion**: Respects user motion preferences

## Technical Stack

- **React 18**: Modern React with hooks and functional components
- **TailwindCSS**: Utility-first CSS framework
- **React Dropzone**: Drag and drop file upload
- **Lucide React**: Beautiful, customizable icons
- **Web APIs**: File API, Speech Synthesis API

## Project Structure

```
src/
├── components/
│   ├── FileUpload.js      # Drag & drop file upload component
│   ├── LoadingSpinner.js  # Loading animation component
│   ├── ResultsDisplay.js  # Results display with speech
│   ├── FeedbackList.js    # Feedback items list
│   └── Header.js          # Application header
├── App.js                 # Main application component
├── index.js              # React entry point
└── index.css             # Global styles with TailwindCSS
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dyslexia-handwriting-analysis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## API Integration

The frontend expects a FastAPI backend with the following endpoint:

### POST `/predict`
**Request:**
- Content-Type: `multipart/form-data`
- Body: Image file in `file` field

**Response:**
```json
{
  "annotated_image": "base64_encoded_image_string",
  "feedback": [
    {
      "reversed_letter": "b",
      "corrected_letter": "d",
      "x": 100,
      "y": 200
    }
  ]
}
```

## Component Architecture

### App.js
Main application component that manages:
- File upload state
- Loading states
- API communication
- Error handling
- Results display

### FileUpload.js
Handles file upload with:
- Drag and drop functionality
- File validation
- Error messaging
- Visual feedback

### ResultsDisplay.js
Displays analysis results with:
- Annotated image rendering
- Speech synthesis integration
- Feedback list rendering
- Reset functionality

### FeedbackList.js
Renders feedback items with:
- Structured feedback display
- Success state handling
- Accessibility features

## Styling

The application uses TailwindCSS with custom dyslexia-friendly styles:

- **Custom Components**: Pre-built component classes
- **Responsive Design**: Mobile-first approach
- **Accessibility**: High contrast and focus indicators
- **Animations**: Smooth transitions and loading states

## Browser Compatibility

- **Chrome**: 60+ (Full support)
- **Firefox**: 55+ (Full support)
- **Safari**: 12+ (Full support)
- **Edge**: 79+ (Full support)

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Style

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **React Hooks**: Functional components with hooks
- **PropTypes**: Type checking for props

## Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Efficient image handling
- **Bundle Optimization**: Minimized bundle size
- **Caching**: Browser caching strategies

## Accessibility Features

- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliant

## Future Enhancements

- **TypeScript**: Add type safety
- **Testing**: Unit and integration tests
- **PWA**: Progressive web app features
- **Offline Support**: Service worker implementation
- **User Accounts**: Authentication and history
- **Batch Processing**: Multiple file upload

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please open an issue in the repository or contact the development team. 