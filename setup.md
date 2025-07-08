# Setup Guide - Dyslexia Handwriting Analysis Tool (React)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Open Browser
Navigate to `http://localhost:3000`

## Project Structure

```
├── public/
│   └── index.html              # Main HTML template
├── src/
│   ├── components/
│   │   ├── FileUpload.js       # Drag & drop file upload
│   │   ├── LoadingSpinner.js   # Loading animation
│   │   ├── ResultsDisplay.js   # Results with speech
│   │   ├── FeedbackList.js     # Feedback items
│   │   └── Header.js           # App header
│   ├── App.js                  # Main app component
│   ├── index.js               # React entry point
│   └── index.css              # Global styles
├── package.json               # Dependencies & scripts
├── tailwind.config.js         # TailwindCSS config
└── README.md                  # Full documentation
```

## Key Features Implemented

✅ **File Upload**
- Drag & drop interface
- File validation (JPG/PNG, 10MB limit)
- Image preview

✅ **Backend Integration**
- POST to `/predict` endpoint
- FormData upload
- Error handling

✅ **Results Display**
- Annotated image rendering
- Structured feedback list
- Voice synthesis

✅ **Dyslexia-Friendly Design**
- Open Sans font
- High contrast
- Increased spacing
- Soft colors

✅ **Accessibility**
- Keyboard navigation
- Screen reader support
- Focus indicators
- High contrast mode

## API Endpoint Expected

The app expects a FastAPI backend at `/predict`:

**Request:** `POST /predict`
- Content-Type: `multipart/form-data`
- Body: `file` (image)

**Response:**
```json
{
  "annotated_image": "base64_string",
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

## Available Scripts

- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run eject` - Eject from CRA

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Next Steps

1. **Backend Integration**: Connect to your FastAPI server
2. **Styling**: Customize colors and layout
3. **Features**: Add user accounts, history, etc.
4. **Testing**: Add unit and integration tests
5. **Deployment**: Build and deploy to production 