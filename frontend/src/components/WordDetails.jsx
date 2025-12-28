function WordDetails({ data, onWordClick }) {
  // Check if it's Bengali word lookup (simpler response)
  const isBengaliLookup = data.bengaliWord && data.englishTranslations;

  if (isBengaliLookup) {
    return (
      <div className="card animate-fade-in">
        <div className="border-b border-gray-700/50 pb-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">বা</span>
            </div>
            <h2 className="text-4xl font-bold bengali-text bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {data.bengaliWord}
            </h2>
          </div>
          <p className="text-sm text-gray-500 ml-13">Serial: {data.serial}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
            </svg>
            English Translations:
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.englishTranslations.map((word, index) => (
              <button
                key={index}
                onClick={() => onWordClick(word)}
                className="group px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30 text-blue-300 rounded-lg transition-all font-medium hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
              >
                {word}
                <svg className="inline-block w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // English word lookup (full details)
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="card">
        <div className="border-b border-gray-700/50 pb-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">En</span>
            </div>
            <h2 className="text-4xl font-bold bengali-text bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {data.word}
            </h2>
          </div>
          {data.transliteration && (
            <p className="text-xl text-gray-400 ml-13 italic font-light">
              {data.transliteration}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-2 ml-13">Serial: {data.serial}</p>
        </div>

        {/* Definitions */}
        {data.definitions && data.definitions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Definitions
            </h3>
            <ul className="space-y-2">
              {data.definitions.map((def, index) => (
                <li key={index} className="flex gap-3 text-gray-300 leading-relaxed">
                  <span className="text-blue-400 font-bold mt-1">{index + 1}.</span>
                  <ClickableText text={def} onWordClick={onWordClick} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples */}
        {data.examples && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Examples
            </h3>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
              <p className="text-gray-300 italic leading-relaxed">
                "<ClickableText text={data.examples} onWordClick={onWordClick} />"
              </p>
            </div>
          </div>
        )}

        {/* Antonyms */}
        {data.antonyms && data.antonyms.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Antonyms
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.antonyms.map((ant, index) => (
                <button
                  key={index}
                  onClick={() => onWordClick(ant)}
                  className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-400/50 rounded-lg text-sm font-medium transition-all hover:scale-105 cursor-pointer"
                >
                  {ant}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Meanings by Part of Speech */}
      {data.meanings && data.meanings.length > 0 && (
        <div className="space-y-4">
          {data.meanings.map((meaning, index) => (
            <div key={index} className="card group hover:border-blue-500/30 transition-all">
              <div className="flex items-center mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 rounded-lg font-bold text-sm uppercase tracking-wide">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {meaning.partOfSpeech}
                </div>
              </div>

              <div className="space-y-4">
                {meaning.words.map((word, wordIndex) => (
                  <div key={wordIndex} className="relative pl-5 py-3 border-l-4 border-gradient-to-b from-blue-500 to-purple-500 hover:border-blue-400 transition-all group/word">
                    <div className="absolute -left-2 top-4 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-800"></div>
                    
                    <div className="text-3xl font-semibold bengali-text text-gray-100 mb-3 group-hover/word:text-blue-300 transition-colors">
                      {word.bengali}
                    </div>
                    
                    {word.relatedEnglish && word.relatedEnglish.length > 0 && (
                      <div className="mt-3 pl-1">
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                          Related English words:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {word.relatedEnglish.map((engWord, engIndex) => (
                            <button
                              key={engIndex}
                              onClick={() => onWordClick(engWord)}
                              className="group/btn px-3 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/30 hover:border-blue-400/50 text-blue-300 hover:text-blue-200 rounded-lg transition-all text-sm font-medium hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                            >
                              <span className="flex items-center gap-1.5">
                                {engWord}
                                <svg className="w-3.5 h-3.5 opacity-0 group-hover/btn:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper component to make words clickable
function ClickableText({ text, onWordClick }) {
  if (!text) return null;
  
  // Split by spaces and punctuation while preserving them
  const parts = text.split(/(\s+|[,.:;!?"'()\[\]{}])/g);
  
  return (
    <span className="inline">
      {parts.map((part, index) => {
        // Check if it's a word (not space or punctuation)
        const isWord = part.trim() && /^[a-zA-Z]+$/.test(part);
        
        if (isWord) {
          return (
            <span
              key={index}
              onClick={() => onWordClick(part)}
              className="hover:text-blue-400 hover:underline cursor-pointer transition-colors inline"
            >
              {part}
            </span>
          );
        }
        
        return <span key={index} className="inline">{part}</span>;
      })}
    </span>
  );
}

export default WordDetails;
