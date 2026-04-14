const router = require('express').Router();
const SocialLink = require('../models/SocialLink');

// Get all social links
router.get('/', async (req, res) => {
    try {
        const links = await SocialLink.find().sort({ date: -1 });
        res.json(links);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a social link
router.post('/', async (req, res) => {
    const link = new SocialLink(req.body);
    try {
        const newLink = await link.save();
        res.status(201).json(newLink);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a social link
router.put('/:id', async (req, res) => {
    try {
        const updatedLink = await SocialLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedLink);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a social link
router.delete('/:id', async (req, res) => {
    try {
        await SocialLink.findByIdAndDelete(req.params.id);
        res.json({ message: 'Social link deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
