require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Bengali-English Dictionary API',
        version: '1.0.0',
        endpoints: {
            search: {
                universal: 'GET /api/search?q=word&limit=10',
                english: 'GET /api/search/english?q=word&limit=10',
                bengali: 'GET /api/search/bengali?q=word&limit=10'
            },
            lookup: {
                universal: 'GET /api/lookup/:word',
                english: 'GET /api/lookup/english/:word',
                bengali: 'GET /api/lookup/bengali/:word'
            },
            health: 'GET /api/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server (only in local development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`🚀 Dictionary API Server Running`);
        console.log(`📍 Port: ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 API: http://localhost:${PORT}/api`);
        console.log(`${'='.repeat(50)}\n`);
    });
}

module.exports = app;
