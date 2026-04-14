const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    duration: { type: String, required: true }, // e.g., "June '25 - July '25"
    fromDate: { type: String },
    toDate: { type: String },
    description: [{ type: String }], // Array of bullet points
    type: { type: String }, // e.g., 'Internship', 'Full-time'
    startDate: { type: Date } // For sorting
});

module.exports = mongoose.model('Experience', ExperienceSchema);
