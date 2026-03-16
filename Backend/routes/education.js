const router = require('express').Router();
const Education = require('../models/Education');

const parseDate = require('../utils/dateParser');

router.get('/', async (req, res) => {
    try {
        const education = await Education.find().sort({ startDate: -1 });
        res.json(education);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    // Auto-detect startDate from fromDate if provided, else fallback to duration
    const sortDateString = req.body.fromDate || req.body.duration;
    const eduData = {
        ...req.body,
        startDate: parseDate(sortDateString)
    };
    const edu = new Education(eduData);
    try {
        const newEdu = await edu.save();
        res.status(201).json(newEdu);
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
        const updatedEdu = await Education.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedEdu);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Education.findByIdAndDelete(req.params.id);
        res.json({ message: 'Education deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
