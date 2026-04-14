const router = require('express').Router();
const Achievement = require('../models/Achievement');

const parseDate = require('../utils/dateParser');

router.get('/', async (req, res) => {
    try {
        const achievements = await Achievement.find().sort({ startDate: -1 });
        res.json(achievements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const achievementData = {
        ...req.body,
        startDate: parseDate(req.body.date)
    };
    const achievement = new Achievement(achievementData);
    try {
        const newAchievement = await achievement.save();
        res.status(201).json(newAchievement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.date) {
            updateData.startDate = parseDate(updateData.date);
        }
        const updatedAchievement = await Achievement.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedAchievement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Achievement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Achievement deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
