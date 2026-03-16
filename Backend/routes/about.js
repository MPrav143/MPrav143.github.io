const router = require('express').Router();
const About = require('../models/About');

// Get all profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await About.find();
        res.json(profiles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a profile
router.post('/', async (req, res) => {
    const profile = new About(req.body);
    try {
        const newProfile = await profile.save();
        res.status(201).json(newProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a profile
router.put('/:id', async (req, res) => {
    try {
        const updatedProfile = await About.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a profile
router.delete('/:id', async (req, res) => {
    try {
        await About.findByIdAndDelete(req.params.id);
        res.json({ message: 'Profile deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
