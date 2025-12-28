import { useState, useEffect, useRef } from 'react';
import { searchWords } from '../services/api';

function SearchBar({ onSearch, currentWord }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Sync query with currentWord from parent
  useEffect(() => {
    if (currentWord !== undefined) {
      setQuery(currentWord);
    }
  }, [currentWord]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const data = await searchWords(query, 10);
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        handleSearch(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSearch(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = (word) => {
    setQuery(word);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch(word);
  };

  const handleClickOutside = (e) => {
    if (
      inputRef.current && !inputRef.current.contains(e.target) &&
      suggestionsRef.current && !suggestionsRef.current.contains(e.target)
    ) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search in English or বাংলা..."
          className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-lg pr-14 group-hover:bg-gray-800/70"
          autoComplete="off"
        />
        <button
          onClick={() => handleSearch(query)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!query.trim()}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-2 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/50 max-h-80 overflow-y-auto custom-scrollbar"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSearch(suggestion)}
              className={`w-full text-left px-5 py-3.5 hover:bg-gray-700/50 transition-all border-b border-gray-700/30 last:border-b-0 first:rounded-t-xl last:rounded-b-xl ${
                index === selectedIndex ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-l-2 border-l-blue-500' : ''
              }`}
            >
              <span className="bengali-text text-gray-200 font-medium">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
