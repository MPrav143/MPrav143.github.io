const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
    visitorCount: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
