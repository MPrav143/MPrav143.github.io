const router = require('express').Router();
const Contact = require('../models/Contact');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify token (admin only)
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// POST: Public - Submit a message
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        // Send email notification using Node Mailer
        const transporter = require('nodemailer').createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: `New Contact Request from ${name}`,
            text: `You have received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        const replyMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for reaching out!',
            text: `Hi ${name},\n\nThank you for reaching out to me. I have received your message and will get back to you soon.\n\nBest regards,\nPraveen M`
        };

        try {
            await transporter.sendMail(mailOptions);
            await transporter.sendMail(replyMailOptions);
            res.json({ message: 'Message sent successfully' });
        } catch (error) {
            console.error('Email send failed:', error);
            res.status(500).json({ error: 'Failed to send email notification' });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Admin Only - Get all messages
router.get('/', verifyToken, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ date: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Admin Only - Delete a message
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
