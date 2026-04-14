const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String }, 
    points: [{ type: String }], 
    techStack: [{ type: String }], 
    category: { type: String }, 
    type: { type: String }, 
    link: { type: String }, // Live link
    repo: { type: String }, // GitHub link
    image: { type: String },
    date: { type: String }, 
    fromDate: { type: String }, 
    toDate: { type: String }, 
    startDate: { type: Date },
    // GitHub specific fields
    githubId: { type: Number, unique: true, sparse: true },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    language: { type: String },
    lastUpdated: { type: Date },
    isApproved: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
