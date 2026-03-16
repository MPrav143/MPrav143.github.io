const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    platform: { type: String, required: true },
    category: { type: String, required: true }, // 'Technical', 'Soft Skills'
    image: { type: String, required: true }, // Cloudinary URL
    pdfLink: { type: String }, // Optional link to PDF
    date: { type: String },
    startDate: { type: Date } // For sorting
});

module.exports = mongoose.model('Certificate', CertificateSchema);
