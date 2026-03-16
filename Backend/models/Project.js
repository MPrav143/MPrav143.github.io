const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String }, // Can be rich text or simple string
    points: [{ type: String }], // Bullet points for details (like in the resume)
    techStack: [{ type: String }], // e.g., ['Python', 'Pandas']
    category: { type: String }, // e.g., 'Data Science', 'Web App', 'Full Stack'
    type: { type: String }, // 'Personal Project', 'Team Project'
    link: { type: String }, // Live link
    repo: { type: String }, // GitHub link
    image: { type: String },
    date: { type: String }, // Optional: Can be used for custom display or removed
    fromDate: { type: String }, // e.g. "July 2023"
    toDate: { type: String }, // e.g. "Aug 2023" or "Present"
    startDate: { type: Date } // For sorting
});

module.exports = mongoose.model('Project', ProjectSchema);
