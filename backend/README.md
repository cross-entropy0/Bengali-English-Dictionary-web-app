# Dictionary Backend API

Bengali-English Dictionary REST API built with Node.js, Express, and MongoDB.

## Features

- ✅ English → Bengali word lookup
- ✅ Bengali → English word lookup  
- ✅ Universal search (auto-detects language)
- ✅ Autocomplete for both languages
- ✅ Parts of speech categorization
- ✅ Related English words for each Bengali meaning
- ✅ Definitions, examples, antonyms

## Installation

```bash
npm install
```

## Environment Variables

Create `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

## Run

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

## API Endpoints

### Search (Autocomplete)

**Universal Search** (auto-detects language)
```
GET /api/search?q=love&limit=10
```

**English Search**
```
GET /api/search/english?q=comp&limit=5
```

**Bengali Search**
```
GET /api/search/bengali?q=ভাল&limit=5
```

### Lookup (Full Details)

**Universal Lookup** (auto-detects language)
```
GET /api/lookup/computer
GET /api/lookup/কম্পিউটার
```

**English Lookup**
```
GET /api/lookup/english/computer
```

**Bengali Lookup**
```
GET /api/lookup/bengali/কম্পিউটার
```

### Health Check
```
GET /api/health
```

## Response Format

### English Lookup Response

```json
{
  "word": "COMPUTER",
  "serial": 32515,
  "transliteration": "Kampi''uṭāra",
  "definitions": ["an electronic device for storing and processing data..."],
  "examples": "The laws were designed to prosecute people who hack into computers...",
  "antonyms": null,
  "meanings": [
    {
      "partOfSpeech": "NOUN",
      "typeId": 5,
      "words": [
        {
          "bengali": "কম্পিউটার",
          "relatedEnglish": ["COMPUTER"],
          "serial": 31192
        },
        {
          "bengali": "গণনার যন্ত্র",
          "relatedEnglish": ["CALCULATING MACHINE", "COMPUTER"],
          "serial": 23595
        }
      ]
    }
  ]
}
```

### Search Response

```json
{
  "query": "comp",
  "suggestions": [
    "COMP",
    "COMPACT",
    "COMPACT CAR",
    "COMPACT DISC",
    "COMPUTER"
  ]
}
```

## Database Structure

- **eng**: English word index (217,688 words)
- **oten**: Bengali words with encrypted English translations (132,899 words)
- **other**: Full word details with encrypted Bengali meanings (217,688 entries)
- **other_words**: Additional word index (207,871 words)

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- XOR decryption for encrypted BLOB fields
- CORS enabled for frontend

## Port

Default: `5000`
