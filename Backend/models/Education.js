const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    duration: { type: String },
    fromDate: { type: String },
    toDate: { type: String },
    gpa: { type: String },
    courses: [{ type: String }], // e.g., ['DBMS', 'OS']
    startDate: { type: Date } // For sorting
});

module.exports = mongoose.model('Education', EducationSchema);
