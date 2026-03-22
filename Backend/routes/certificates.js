const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const verifyToken = require('../middleware/auth');
const parseDate = require('../utils/dateParser');

// Get All Certificates
router.get('/', async (req, res) => {
    try {
        // Sort by 'index' (manual sorting), then by date descending
        const certs = await Certificate.find().sort({ index: 1, startDate: -1 });
        res.json(certs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add New Certificate (Protected)
router.post('/', verifyToken, async (req, res) => {
    const certData = {
        title: req.body.title,
        platform: req.body.platform,
        category: req.body.category,
        image: req.body.image,
        pdfLink: req.body.pdfLink,
        date: req.body.date,
        startDate: parseDate(req.body.date),
        companyLogo: req.body.companyLogo,
        description: req.body.description,
        index: req.body.index || 0
    };
    const cert = new Certificate(certData);

    try {
        const newCert = await cert.save();
        res.status(201).json(newCert);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Certificate (Protected)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.date) {
            updateData.startDate = parseDate(updateData.date);
        }
        const updatedCert = await Certificate.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedCert);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Certificate (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Certificate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Certificate Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
