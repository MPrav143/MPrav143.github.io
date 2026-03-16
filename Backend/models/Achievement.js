const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String },
    link: { type: String }, // Proof link if any
    startDate: { type: Date } // For sorting
});

module.exports = mongoose.model('Achievement', AchievementSchema);
