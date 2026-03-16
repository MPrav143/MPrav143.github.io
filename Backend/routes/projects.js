const router = require('express').Router();
const Project = require('../models/Project');
const verifyToken = require('../middleware/auth');

const parseDate = require('../utils/dateParser');

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ startDate: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    // Auto-detect startDate from fromDate if provided, else fallback to date
    const sortDateString = req.body.fromDate || req.body.date;
    const projectData = {
        ...req.body,
        startDate: parseDate(sortDateString)
    };
    const project = new Project(projectData);
    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updateData = { ...req.body };
        // Recalculate startDate if fromDate or date changes
        const sortDateString = updateData.fromDate || updateData.date;
        if (sortDateString) {
            updateData.startDate = parseDate(sortDateString);
        }
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
