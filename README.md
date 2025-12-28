# Bengali-English Dictionary Web Application

A full-stack MERN application that replicates the functionality of the "English Bangla Dictionary" Android app by Innovative-Software, providing rich English↔Bengali translation with 350,000+ words in a modern web interface.

## 🎯 Project Origin & Problem Statement

### The Problem
There is no comprehensive, free, public English-Bengali dictionary API or dataset available online. Existing solutions either:
- Have limited vocabulary coverage
- Require paid subscriptions (like Google Translate API)
- Lack rich linguistic data (definitions, examples, antonyms, parts of speech)

### The Solution Approach
The "English Bangla Dictionary" Android app (available on Play Store) works **offline**, meaning it must store the complete dictionary database locally. This project reverse-engineered that app to:

1. **Extract the Database**: Found `pbd400.db` (SQLite) in Android app files containing 776,146+ dictionary entries
2. **Decrypt the Data**: Dictionary meanings were XOR-encrypted; decryption key was reverse-engineered from decompiled APK source code
3. **Migrate to Cloud**: Uploaded decrypted data to MongoDB Atlas for web access
4. **Replicate Functionality**: Built a MERN stack web application matching the Android app's features

This approach provides a **free, rich, comprehensive** English-Bengali dictionary dataset without API fees or limitations.

## 🏗️ Technical Architecture

### Data Extraction Journey

```
Android APK (com-dic-bn-745-*.apk)
    ↓
Decompiled Source Code (sources/com/bappi/db/)
    ↓
Found: DatabaseHelper.java, DatabaseAccessor.java
    ↓
Discovered: XOR encryption with private key
    ↓
Extracted: pbd400.db (SQLite, ~400MB)
    ↓
Decrypted & Migrated: MongoDB Atlas (776,146 documents)
    ↓
Web Application: MERN Stack
```

### Database Schema

The original Android app uses 4 main tables:

#### 1. `eng` Collection (217,688 English words)
```javascript
{
  serial: 1,
  word: "computer",
  ed: <encrypted BLOB>  // Contains [[typeId, serial1, serial2, ...]]
}
```

#### 2. `oten` Collection (132,899 Bengali words)
```javascript
{
  serial: 1,
  ot: "কম্পিউটার",
  en: <encrypted BLOB>  // Contains [serial1, serial2, ...] of English words
}
```

#### 3. `other` Collection (217,688 detailed entries)
```javascript
{
  serial: 1,
  word: "computer",
  ed: <encrypted BLOB>,  // Full meaning data
  tr: "transliteration",
  ant: "analog computer, digital computer",
  def: "definitions text",
  exm: "example sentences"
}
```

#### 4. `other_words` Collection (207,871 additional entries)
```javascript
{
  word: "computing"
}
```

### Encryption Details

- **Algorithm**: XOR cipher (symmetric)
- **Key**: Private (stored in environment variables)
- **Encrypted Fields**: `ed` (English definitions), `en` (cross-references)
- **Data Format**: After decryption, BLOBs contain UTF-8 JSON arrays

### Parts of Speech Mapping

The `typeId` in encrypted data maps to 17 grammatical categories:

| Type ID | Part of Speech | Example |
|---------|---------------|---------|
| 1 | ARTICLE | a, an, the |
| 2 | MORE | additional info |
| 3 | ADVERB | quickly, slowly |
| 4 | ADJECTIVE | beautiful, large |
| 5 | NOUN | computer, book |
| 6 | PREFIX | pre-, un- |
| 7 | PREPOSITION | in, on, at |
| 8 | VERB | run, write, read |
| 9 | ABBREVIATION | Dr., Mr. |
| 10 | CONJUNCTION | and, but, or |
| 11 | PRONOUN | he, she, it |
| 12 | PHRASE | phrasal verb |
| 13 | INTERJECTION | oh!, wow! |
| 15 | AUXILIARY VERB | is, are, was |
| 16 | SUFFIX | -ing, -ed |
| 17 | PARTICLE | up, down (phrasal) |

## 🚀 Features

### Core Dictionary Features (Replicated from Android App)
- ✅ **English → Bengali Lookup**: Search English word, get Bengali meanings grouped by parts of speech
- ✅ **Bengali → English Lookup**: Search Bengali word, get related English words
- ✅ **Rich Linguistic Data**: 
  - Definitions (def)
  - Example sentences (exm)
  - Antonyms (ant)
  - Transliteration (tr)
  - Parts of speech classification
- ✅ **Autocomplete**: Real-time suggestions for both languages
- ✅ **Cross-referencing**: Click any Bengali word to see its English translations

### Enhanced Web Features (Beyond Android App)
- 🎨 **Modern Dark Theme UI**: Gradient-based design with glassmorphism effects
- 🔊 **Audio Pronunciation**: Click to hear English words spoken (DictionaryAPI.dev integration)
- 🔙 **Navigation History**: Back button to return to previous searches
- 🖱️ **Interactive Text**: Click any word in definitions/examples/antonyms to search instantly
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ⚡ **Fast Search**: Optimized MongoDB queries with text indexing

## 📂 Project Structure

```
dictionary-webapp/
├── backend/                    # Express.js REST API
│   ├── config/
│   │   └── db.js              # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── lookupController.js    # English/Bengali word lookup
│   │   └── searchController.js    # Autocomplete & search
│   ├── models/
│   │   └── Dictionary.js      # Mongoose schemas (eng, oten, other, other_words)
│   ├── routes/
│   │   └── api.js             # API endpoint definitions
│   ├── utils/
│   │   ├── encryption.js      # XOR decryption (key from env vars)
│   │   ├── typeMapping.js     # Parts of speech mapping
│   │   └── textUtils.js       # Language detection, JSON parsing
│   ├── .env.example           # Environment template
│   ├── server.js              # Express app entry point
│   └── package.json
│
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx      # Autocomplete search input
│   │   │   └── WordDetails.jsx    # Word display with clickable text
│   │   ├── services/
│   │   │   └── api.js             # Axios API client
│   │   ├── App.jsx                # Main app with history & audio
│   │   └── index.css              # Tailwind + custom dark theme
│   ├── .env.example           # Frontend config template
│   ├── vite.config.js         # Vite dev server config
│   └── package.json
│
└── README.md                  # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js** 18+ - Runtime environment
- **Express.js** 4.18.2 - Web framework
- **MongoDB Atlas** - Cloud database (776K+ documents)
- **Mongoose** 8.0.0 - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** 18.2.0 - UI library
- **Vite** 5.0.8 - Build tool and dev server
- **Tailwind CSS** 3.4.0 - Utility-first styling
- **Axios** 1.6.2 - HTTP client
- **DictionaryAPI.dev** - Audio pronunciation source

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- MongoDB Atlas account (free tier sufficient)
- The private XOR decryption key (not included in repository)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your configuration:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dictionary
PORT=5001
NODE_ENV=development
XOR_ENCRYPTION_KEY=<your-private-decryption-key>
```

**⚠️ Security Note**: The `XOR_ENCRYPTION_KEY` is private and not included in this repository. See [SECURITY.md](../SECURITY.md).

```bash
# Start backend server
npm start

# Server runs on http://localhost:5001
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# (Optional) Create .env for custom API URL
cp .env.example .env
```

If needed, edit `.env`:
```bash
VITE_API_URL=http://localhost:5001/api
```

```bash
# Start development server
npm run dev

# App opens at http://localhost:3000
```

## 📡 API Endpoints

### Health Check
```http
GET /api/health
Response: { status: "ok", timestamp: "..." }
```

### Universal Lookup (Auto-detects Language)
```http
GET /api/lookup/:word

Examples:
GET /api/lookup/computer    # English → Bengali
GET /api/lookup/কম্পিউটার   # Bengali → English

Response:
{
  "word": "computer",
  "language": "english",
  "meanings": [
    {
      "type": "NOUN",
      "words": ["কম্পিউটার", "গণনাকারী"],
      "bengaliWords": [...]
    }
  ],
  "definitions": "...",
  "examples": "...",
  "antonyms": "analog computer, digital computer"
}
```

### Universal Search (Auto-detects Language)
```http
GET /api/search?q=comp

Response:
{
  "query": "comp",
  "language": "english",
  "suggestions": ["computer", "company", "complete", ...]
}
```

### Language-Specific Search
```http
GET /api/search/english?q=comp
GET /api/search/bengali?q=কম্পি

Response:
{
  "suggestions": ["computer", "company", ...]
}
```

## 🧪 Testing

### Backend API Tests
```bash
cd backend

# Health check
curl http://localhost:5001/api/health

# English lookup
curl http://localhost:5001/api/lookup/hello

# Bengali lookup
curl "http://localhost:5001/api/lookup/কম্পিউটার"

# Autocomplete
curl "http://localhost:5001/api/search?q=comp"
```

### Frontend Tests
1. Open http://localhost:3000
2. **English Search**: Type "computer" → Verify Bengali meanings appear → Click pronounce button
3. **Bengali Search**: Type "কম্পিউটার" → Verify English translations appear
4. **Autocomplete**: Type "comp" → Verify dropdown shows suggestions
5. **Clickable Text**: Click any word in definitions/examples → Verify it searches
6. **Navigation**: Click back button → Verify returns to previous search
7. **Antonyms**: Click any antonym → Verify it searches

## 🚀 Deployment

### Deploy to Vercel

#### Backend
```bash
cd backend
vercel

# Add environment variables in Vercel Dashboard:
# - MONGODB_URI
# - XOR_ENCRYPTION_KEY
# - NODE_ENV=production
```

#### Frontend
```bash
cd frontend

# Update .env with deployed backend URL
echo "VITE_API_URL=https://your-backend.vercel.app/api" > .env

vercel
```

See [../DEPLOYMENT.md](../DEPLOYMENT.md) for detailed deployment guide.

## 🔒 Security & Privacy

**⚠️ IMPORTANT**: This is **NOT** a fully open-source project.

### What's Private
- 📊 **Dictionary Database**: The `pbd400.db` file and MongoDB data are proprietary
- 🔑 **XOR Encryption Key**: The decryption key is private and not committed to GitHub
- 💾 **MongoDB Credentials**: Database connection strings are in local `.env` files only

### What's Public (This Repository)
- ✅ Source code architecture and implementation
- ✅ XOR decryption algorithm (without the key)
- ✅ Database schema and structure
- ✅ UI/UX design and components
- ✅ API endpoint design

**Read [../SECURITY.md](../SECURITY.md) for complete security guidelines.**

## 🎨 UI/UX Features

### Dark Theme Design
- **Background**: Gradient from dark gray to darker blue
- **Glassmorphism**: Backdrop blur effects on cards
- **Smooth Animations**: Fade-in effects for content
- **Custom Scrollbar**: Themed scrollbar matching dark design
- **Typography**: Noto Sans Bengali font for proper Bengali rendering

### Interactive Elements
- **Hover Effects**: Words underline on hover, buttons scale
- **Clickable Words**: Any word in definitions/examples/antonyms is clickable
- **Pronounce Button**: Audio playback with visual feedback
- **Back Button**: Appears when history exists
- **Loading States**: Skeleton screens during data fetch

## 📊 Database Statistics

- **Total Documents**: 776,146
- **English Words**: 217,688 (eng collection)
- **Bengali Words**: 132,899 (oten collection)
- **Detailed Entries**: 217,688 (other collection)
- **Additional Words**: 207,871 (other_words collection)
- **Database Size**: ~400MB (original SQLite)
- **Encrypted Fields**: 2 per entry (ed, en)

## 🐛 Troubleshooting

### Backend Issues

**Error: "XOR_ENCRYPTION_KEY environment variable is required"**
- Ensure `.env` file exists in `backend/` directory
- Verify `XOR_ENCRYPTION_KEY` is set in `.env`
- Restart the server after adding the key

**Error: "MongoServerError: Authentication failed"**
- Check `MONGODB_URI` in `.env` is correct
- Ensure MongoDB Atlas IP whitelist includes your IP (or use 0.0.0.0/0 for development)
- Verify database user has read/write permissions

**Empty meanings array returned**
- This was caused by BSON Binary type handling
- Fixed in `lookupController.js` with Buffer.isBuffer() check

### Frontend Issues

**Error: "Cannot read property 'map' of undefined"**
- Backend might not be running (check http://localhost:5001/api/health)
- CORS issue - ensure backend allows frontend origin
- Check browser console for API errors

**Autocomplete not working**
- Verify search API endpoint is accessible
- Check debounce delay (300ms) - might seem delayed
- Ensure query is at least 1 character

**Audio pronunciation not working**
- Only works for English words
- Requires internet connection (fetches from DictionaryAPI.dev)
- Some words might not have audio available

## 📚 Reverse Engineering Notes

### Key Files from Android APK

Located in `com-dic-bn-745-*/sources/com/bappi/`:

- **DatabaseHelper.java**: Database initialization, version management (hardcoded v400)
- **DatabaseAccessor.java**: All SQL queries and data access methods
- **EncryptionUtils.java**: XOR encryption/decryption implementation
- **DictionaryActivity.java**: Main app UI and search logic (3490+ lines)

### How Lookup Works in Android App

1. User searches English word "computer"
2. App queries `eng` table: `SELECT * FROM eng WHERE word = 'computer'`
3. Gets `serial` and encrypted `ed` field
4. Decrypts `ed` using XOR with private key
5. Parses JSON: `[[typeId, serial1, serial2], ...]`
6. For each serial, queries `oten` table to get Bengali words
7. Groups results by `typeId` (parts of speech)
8. Queries `other` table for definitions, examples, antonyms
9. Displays formatted results

This web app replicates this exact logic in JavaScript.

## 🤝 Contributing

Since this project uses proprietary dictionary data, contributions are limited to:
- 🐛 Bug fixes in application logic
- ✨ UI/UX improvements
- 🚀 Performance optimizations
- 📝 Documentation improvements
- 🧪 Test coverage

**Do NOT commit**:
- Actual encryption keys
- Database files
- MongoDB credentials
- Any proprietary dictionary data

## 📄 License

MIT License for the application code. Dictionary data is proprietary and not covered by this license.

## 🙏 Acknowledgments

- **Innovative-Software**: Original Android app developers
- **DictionaryAPI.dev**: Audio pronunciation API
- **MongoDB Atlas**: Database hosting
- **Vercel**: Deployment platform

---

**Project Repository Structure**:
```
dict apk/                       (Root - Reverse engineering artifacts)
├── com-dic-bn-745-*/          (Decompiled APK source code)
├── db/                        (Database extraction scripts)
├── dictionary-project/        (New web application)
│   ├── dictionary-webapp/     (This MERN app)
│   ├── README.md             (Project overview)
│   ├── DEPLOYMENT.md         (Deploy guide)
│   ├── SECURITY.md           (Security guidelines)
│   └── CHECKLIST.md          (Pre-deploy checklist)
└── *.js, *.md               (Research & testing scripts)
```
