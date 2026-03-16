const router = require('express').Router();
const Analytics = require('../models/Analytics');
const Contact = require('../models/Contact');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');

// Get all analytics data
router.get('/', async (req, res) => {
    try {
        let analytics = await Analytics.findOne();
        if (!analytics) {
            analytics = new Analytics({ visitorCount: 0 });
            await analytics.save();
        }

        const contactCount = await Contact.countDocuments();
        const projectCount = await Project.countDocuments();
        const certificateCount = await Certificate.countDocuments();

        console.log('--- DEBUG ANALYTICS ---');
        console.log('Project Count:', projectCount);
        console.log('Contact Count:', contactCount);
        console.log('Visitor Count:', analytics.visitorCount);

        res.json({
            visitorCount: analytics.visitorCount,
            contactCount,
            projectCount,
            certificateCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Increment visitor count
router.post('/visit', async (req, res) => {
    try {
        let analytics = await Analytics.findOne();
        if (!analytics) {
            analytics = new Analytics({ visitorCount: 1 });
        } else {
            analytics.visitorCount += 1;
            analytics.lastUpdated = Date.now();
        }
        await analytics.save();
        res.json({ visitorCount: analytics.visitorCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
