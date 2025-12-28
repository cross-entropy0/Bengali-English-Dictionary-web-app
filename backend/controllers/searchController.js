const { Eng, Oten, Other } = require('../models/Dictionary');
const { xorDecrypt } = require('../utils/encryption');
const { getTypeName } = require('../utils/typeMapping');
const { isBengali, safeParseJSON } = require('../utils/textUtils');

/**
 * Search for English words with autocomplete
 */
exports.searchEnglishWords = async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;
        
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const searchTerm = q.toUpperCase().trim();
        
        const results = await Eng.find({
            word: { $regex: `^${searchTerm}`, $options: 'i' }
        })
        .limit(parseInt(limit))
        .select('word -_id')
        .lean();

        res.json({
            query: q,
            suggestions: results.map(r => r.word)
        });
        
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
};

/**
 * Search for Bengali words with autocomplete
 */
exports.searchBengaliWords = async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;
        
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const searchTerm = q.trim();
        
        const results = await Oten.find({
            ot: { $regex: `^${searchTerm}` }
        })
        .limit(parseInt(limit))
        .select('ot -_id')
        .lean();

        // Get unique words
        const uniqueWords = [...new Set(results.map(r => r.ot))];

        res.json({
            query: q,
            suggestions: uniqueWords
        });
        
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
};

/**
 * Universal search - detects language and searches accordingly
 */
exports.universalSearch = async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;
        
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // Detect language
        if (isBengali(q)) {
            return exports.searchBengaliWords(req, res);
        } else {
            return exports.searchEnglishWords(req, res);
        }
        
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
};
