const router = require('express').Router();
const Experience = require('../models/Experience');

const parseDate = require('../utils/dateParser');

router.get('/', async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ startDate: -1 });
        res.json(experiences);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    // Auto-detect startDate from fromDate if provided, else fallback to duration
    const sortDateString = req.body.fromDate || req.body.duration;
    const experienceData = {
        ...req.body,
        startDate: parseDate(sortDateString)
    };
    const experience = new Experience(experienceData);
    try {
        const newExperience = await experience.save();
        res.status(201).json(newExperience);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        // Recalculate startDate if fromDate or duration changes
        const sortDateString = updateData.fromDate || updateData.duration;
        if (sortDateString) {
            updateData.startDate = parseDate(sortDateString);
        }
        const updatedExperience = await Experience.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedExperience);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Experience.findByIdAndDelete(req.params.id);
        res.json({ message: 'Experience deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
