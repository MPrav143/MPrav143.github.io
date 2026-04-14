const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    platform: { type: String, required: true },
    category: { type: String, required: true }, // 'Technical', 'Soft Skills'
    image: { type: String, required: true }, // Certificate preview image
    pdfLink: { type: String }, // Optional link to credential
    date: { type: String },
    startDate: { type: Date }, // For sorting fallback
    companyLogo: { type: String }, // Logo image URL for Back
    description: { type: String }, // Back description text
    index: { type: Number, default: 0 } // Reorder custom list index
});

module.exports = mongoose.model('Certificate', CertificateSchema);
