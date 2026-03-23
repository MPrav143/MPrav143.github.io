const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (CORS must be first)
// Middleware (CORS must be first)
app.use(cors({
    origin: ['http://localhost:5173', 'https://mprav143.github.io', 'https://praveenmurugan.me'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'auth-token']
}));

app.use(express.json());

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// app.use(mongoSanitize());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000 // Increased for development
});
app.use('/api', limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/about', require('./routes/about'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/education', require('./routes/education'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/leetcode', require('./routes/leetcode'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/sociallinks', require('./routes/socialLinks'));
app.use('/api/chat', require('./routes/chat'));

app.get('/', (req, res) => {
    res.send('Portfolio Backend is running');
});

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
