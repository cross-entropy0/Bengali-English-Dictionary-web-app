const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const lookupController = require('../controllers/lookupController');

// Search routes
router.get('/search/english', searchController.searchEnglishWords);
router.get('/search/bengali', searchController.searchBengaliWords);
router.get('/search', searchController.universalSearch);

// Lookup routes
router.get('/lookup/english/:word', lookupController.lookupEnglishWord);
router.get('/lookup/bengali/:word', lookupController.lookupBengaliWord);
router.get('/lookup/:word', lookupController.universalLookup);

// Health check
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Dictionary API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
