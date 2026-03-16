const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    category: { type: String, required: true }, // e.g., 'Languages', 'Tools', 'Soft Skills'
    items: [{ type: String }], // list of skills in that category
    icon: { type: String } // Optional icon for the category
});

module.exports = mongoose.model('Skill', SkillSchema);
