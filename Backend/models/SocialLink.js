const mongoose = require('mongoose');

const SocialLinkSchema = new mongoose.Schema({
    platform: { type: String, required: true }, // e.g., "LinkedIn", "GitHub", "WhatsApp"
    url: { type: String, required: true },
    icon: { type: String }, // optional, for choosing icon types if needed
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SocialLink', SocialLinkSchema);
