import { useState } from 'react';
import SearchBar from './components/SearchBar';
import WordDetails from './components/WordDetails';
import { lookupWord } from './services/api';
import axios from 'axios';

function App() {
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentWord, setCurrentWord] = useState('');
  const [history, setHistory] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  const handleSearch = async (word, addToHistory = true) => {
    if (!word.trim()) {
      setWordData(null);
      return;
    }

    // Add current word to history before searching new one
    if (addToHistory && currentWord && currentWord !== word) {
      setHistory(prev => [...prev, { word: currentWord, data: wordData }]);
    }

    setCurrentWord(word);
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    
    try {
      const data = await lookupWord(word);
      setWordData(data);
      
      // Fetch pronunciation for English words
      if (!data.bengaliWord) {
        fetchPronunciation(word);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch word details');
      setWordData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPronunciation = async (word) => {
    setAudioLoading(true);
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (response.data && response.data[0] && response.data[0].phonetics) {
        const audioPhonetic = response.data[0].phonetics.find(p => p.audio);
        if (audioPhonetic && audioPhonetic.audio) {
          setAudioUrl(audioPhonetic.audio);
        }
      }
    } catch (err) {
      console.log('No pronunciation available');
    } finally {
      setAudioLoading(false);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentWord(previous.word);
      setWordData(previous.data);
      
      // Fetch pronunciation for previous word if English
      if (!previous.data.bengaliWord) {
        fetchPronunciation(previous.word);
      } else {
        setAudioUrl(null);
      }
    }
  };

  const playPronunciation = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Bengali-English Dictionary
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {(217688 + 132899).toLocaleString()} words • English ⇄ বাংলা
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-3 mb-4">
            {/* Back Button */}
            {history.length > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl text-gray-300 transition-all hover:scale-105"
                title="Go back to previous word"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back</span>
              </button>
            )}
            
            {/* Pronunciation Button */}
            {audioUrl && !audioLoading && (
              <button
                onClick={playPronunciation}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 rounded-xl text-green-300 transition-all hover:scale-105"
                title="Play pronunciation"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Pronounce</span>
              </button>
            )}
            
            {audioLoading && (
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                <span className="text-sm">Loading audio...</span>
              </div>
            )}
          </div>
          
          <SearchBar onSearch={handleSearch} currentWord={currentWord} />
        </div>

        {/* Results Section */}
        {loading && (
          <div className="card text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        )}

        {error && (
          <div className="card bg-red-900/20 border border-red-500/30 text-red-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && wordData && (
          <WordDetails data={wordData} onWordClick={(word) => handleSearch(word, true)} />
        )}

        {!loading && !error && !wordData && (
          <div className="card text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl mb-6">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Start Your Search</h3>
            <p className="text-gray-500 mb-4">Type any word in English or Bengali</p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <button onClick={() => handleSearch('computer')} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
                Try "computer"
              </button>
              <button onClick={() => handleSearch('love')} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
                Try "love"
              </button>
              <button onClick={() => handleSearch('কম্পিউটার')} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors bengali-text">
                Try "কম্পিউটার"
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-6 text-center text-gray-500 text-sm border-t border-gray-800">
        <p>Bengali-English Dictionary • Powered by 350K+ word database</p>
      </footer>
    </div>
  );
}

export default App;
