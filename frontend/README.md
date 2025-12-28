# Bengali-English Dictionary Frontend

React + Vite + Tailwind CSS web application for the Bengali-English Dictionary.

## ✨ Features

- **Universal Search**: Auto-detects English or Bengali input
- **Real-time Autocomplete**: Suggests words as you type
- **Detailed Word Lookup**: 
  - Definitions, examples, antonyms
  - Parts of speech (Noun, Verb, Adjective, etc.)
  - Bengali translations with transliteration
  - Related English words (clickable)
- **Beautiful UI**: Responsive design with Bengali font support
- **Fast Performance**: Powered by Vite and optimized API calls

## 🚀 Running the Frontend

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx      # Search input with autocomplete
│   │   └── WordDetails.jsx    # Word details display
│   ├── services/
│   │   └── api.js             # API client
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind + custom styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🔗 API Connection

Backend must be running on `http://localhost:5001`

```bash
# In backend directory
cd ../backend
npm start
```

## 🎨 Key Components

### SearchBar
- Debounced search with 300ms delay
- Keyboard navigation (Arrow keys, Enter, Escape)
- Click outside to close suggestions
- Support for both English and Bengali input

### WordDetails
- English → Bengali: Shows definitions, examples, antonyms, and meanings by part of speech
- Bengali → English: Shows all English translations as clickable buttons
- All English words are clickable to perform new lookups

## 🌐 Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

## 📊 Data

- **217,688** English words
- **132,899** Bengali words
- **17** parts of speech categories
- Full cross-referencing between languages
