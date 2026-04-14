const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true }, // e.g., "Data Science Enthusiast" or "MERN Stack Developer"
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    summary: { type: String, required: true }, // The main bio paragraph
    profileImage: { type: String }, // URL to image
    socialLinks: {
        linkedin: String,
        github: String,
        portfolio: String,
        other: String
    },
    leadership: [{
        role: String,
        period: String,
        organization: String
    }],
    resume: { type: String }, // URL to resume PDF
    identifier: { type: String, unique: true }, // e.g., 'datascience' or 'fullstack' to distinguish profiles if needed
    sectionBackgrounds: {
        hero: String,
        about: String,
        education: String,
        experience: String,
        projects: String,
        skills: String,
        leetcode: String,
        certificates: String,
        achievements: String,
        contact: String
    }
});

module.exports = mongoose.model('About', AboutSchema);
