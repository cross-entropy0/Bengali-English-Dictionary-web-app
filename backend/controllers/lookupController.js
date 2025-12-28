const { Eng, Oten, Other } = require('../models/Dictionary');
const { xorDecrypt } = require('../utils/encryption');
const { getTypeName } = require('../utils/typeMapping');
const { isBengali, safeParseJSON } = require('../utils/textUtils');

/**
 * Lookup English word - returns full dictionary entry
 */
exports.lookupEnglishWord = async (req, res) => {
    try {
        const { word } = req.params;
        
        if (!word) {
            return res.status(400).json({ error: 'Word parameter is required' });
        }

        const searchWord = word.toUpperCase().trim();

        // Step 1: Find serial from eng table
        const engEntry = await Eng.findOne({ word: searchWord }).lean();
        
        if (!engEntry) {
            return res.status(404).json({ 
                error: 'Word not found',
                word: word
            });
        }

        // Step 2: Get detailed data from other table
        const otherEntry = await Other.findOne({ serial: engEntry.serial }).lean();
        
        if (!otherEntry) {
            return res.status(404).json({ 
                error: 'Word details not found',
                word: word
            });
        }

        // Build response
        const result = {
            word: otherEntry.word,
            serial: otherEntry.serial,
            transliteration: otherEntry.tr || null,
            definitions: safeParseJSON(otherEntry.def),
            examples: otherEntry.exm || null,
            antonyms: safeParseJSON(otherEntry.ant),
            meanings: []
        };

        // Step 3: Decrypt and parse Bengali meanings
        if (otherEntry.ed) {
            try {
                // Convert to Buffer if it's a BSON Binary
                const edBuffer = Buffer.isBuffer(otherEntry.ed) 
                    ? otherEntry.ed 
                    : Buffer.from(otherEntry.ed.buffer || otherEntry.ed);
                
                if (edBuffer.length === 0) {
                    return res.json(result);
                }
                
                const decrypted = xorDecrypt(edBuffer);
                const meaningData = JSON.parse(decrypted);
                
                // Extract all Bengali word serials
                const serialsToFetch = [];
                meaningData.forEach(item => {
                    for (let i = 1; i < item.length; i++) {
                        serialsToFetch.push(item[i]);
                    }
                });
                
                // Step 4: Fetch Bengali words from oten table
                if (serialsToFetch.length > 0) {
                    const bengaliWords = await Oten.find({
                        serial: { $in: serialsToFetch }
                    }).lean();
                    
                    // Create a map: serial -> {bengaliWord, englishWords}
                    const serialToData = {};
                    
                    for (const row of bengaliWords) {
                        const englishWords = [];
                        
                        // Decrypt English translations for this Bengali word
                        if (row.en) {
                            try {
                                const enBuffer = Buffer.isBuffer(row.en) 
                                    ? row.en 
                                    : Buffer.from(row.en.buffer || row.en);
                                    
                                if (enBuffer.length > 0) {
                                    const enDecrypted = xorDecrypt(enBuffer);
                                    const enParsed = JSON.parse(enDecrypted);
                                    englishWords.push(...enParsed);
                                }
                            } catch (e) {
                                // If not array, might be single string
                            }
                        }
                        
                        serialToData[row.serial] = {
                            bengaliWord: row.ot,
                            relatedEnglishWords: englishWords
                        };
                    }
                    
                    // Step 5: Build meanings by part of speech
                    meaningData.forEach(item => {
                        const typeId = item[0];
                        const words = [];
                        
                        for (let i = 1; i < item.length; i++) {
                            const serial = item[i];
                            const data = serialToData[serial];
                            
                            if (data) {
                                words.push({
                                    bengali: data.bengaliWord,
                                    relatedEnglish: data.relatedEnglishWords,
                                    serial: serial
                                });
                            }
                        }
                        
                        result.meanings.push({
                            partOfSpeech: getTypeName(typeId),
                            typeId: typeId,
                            words: words
                        });
                    });
                }
            } catch (decryptErr) {
                console.error('Decryption error:', decryptErr.message);
            }
        }

        res.json(result);
        
    } catch (error) {
        console.error('Lookup error:', error);
        res.status(500).json({ error: 'Lookup failed' });
    }
};

/**
 * Lookup Bengali word - returns English translations
 */
exports.lookupBengaliWord = async (req, res) => {
    try {
        const { word } = req.params;
        
        if (!word) {
            return res.status(400).json({ error: 'Word parameter is required' });
        }

        const searchWord = word.trim();

        const otenEntry = await Oten.findOne({ ot: searchWord }).lean();
        
        if (!otenEntry) {
            return res.status(404).json({ 
                error: 'Bengali word not found',
                word: word
            });
        }

        const result = {
            bengaliWord: otenEntry.ot,
            serial: otenEntry.serial,
            englishTranslations: []
        };

        // Decrypt English translations
        if (otenEntry.en) {
            try {
                const enBuffer = Buffer.isBuffer(otenEntry.en) 
                    ? otenEntry.en 
                    : Buffer.from(otenEntry.en.buffer || otenEntry.en);
                    
                if (enBuffer.length > 0) {
                    const decrypted = xorDecrypt(enBuffer);
                    const translationData = JSON.parse(decrypted);
                    result.englishTranslations = translationData;
                }
            } catch (decryptErr) {
                console.error('Decryption error:', decryptErr.message);
            }
        }

        res.json(result);
        
    } catch (error) {
        console.error('Lookup error:', error);
        res.status(500).json({ error: 'Lookup failed' });
    }
};

/**
 * Universal lookup - detects language and looks up accordingly
 */
exports.universalLookup = async (req, res) => {
    try {
        const { word } = req.params;
        
        if (!word) {
            return res.status(400).json({ error: 'Word parameter is required' });
        }

        // Detect language
        if (isBengali(word)) {
            return exports.lookupBengaliWord(req, res);
        } else {
            return exports.lookupEnglishWord(req, res);
        }
        
    } catch (error) {
        console.error('Lookup error:', error);
        res.status(500).json({ error: 'Lookup failed' });
    }
};
