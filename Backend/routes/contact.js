const router = require('express').Router();
const Contact = require('../models/Contact');
const SocialLink = require('../models/SocialLink');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// 🔐 Middleware: Verify Admin Token
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

// 📩 POST: Public - Submit Message
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Save to DB
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        // 📧 Mail Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 5000, 
            greetingTimeout: 5000,
            socketTimeout: 5000
        });

        // 📬 Admin Notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Contact Request from ${name}`,
            text: `
You have received a new message:

Name: ${name}
Email: ${email}
Message: ${message}
            `
        };

        // 🔗 Fetch Social Links
        const linkList = await SocialLink.find();

        const linksHtml = linkList.map(link => `
            <a href="${link.url}" target="_blank"
               style="color:#22d3ee;text-decoration:none;font-size:13px;margin:0 6px;">
               ${link.platform}
            </a>
        `).join('<span style="color:#475569;">|</span>');

        const replyMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Thank you for reaching out!",
            html: `
  <div style="margin:0;padding:0;background-color:#0f172a;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
      <tr>
        <td align="center">

          <!-- Main Card -->
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#020617;border-radius:14px;border:1px solid #1e293b;overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(90deg,#06b6d4,#8b5cf6,#ec4899);height:5px;"></td>
            </tr>

            <tr>
              <td align="center" style="padding:30px 25px 10px;">
                <div style="font-size:38px;">🚀</div>
                <h1 style="color:#f8fafc;font-size:24px;margin:10px 0;">
                  Thank you for reaching out, ${name}!
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:10px 30px;text-align:center;">

                <p style="color:#cbd5e1;font-size:15px;line-height:1.7;">
                  I truly appreciate you taking the time to connect with me through my portfolio.
                </p>

                <p style="color:#cbd5e1;font-size:15px;line-height:1.7;">
                  Your message has been received successfully and is important to me.  
                  I carefully review every inquiry to ensure a thoughtful response.
                </p>

                <p style="color:#cbd5e1;font-size:15px;line-height:1.7;">
                  You can expect a reply within <strong style="color:#22d3ee;">24 hours</strong>.
                </p>

              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td align="center" style="padding:20px;">
                <a href="https://praveenmurugan.me"
                  style="display:inline-block;background:#06b6d4;color:#000;
                  padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">
                  🌐 Explore My Portfolio
                </a>
              </td>
            </tr>

            <!-- Links Section -->
            <tr>
              <td align="center" style="padding:20px;">
                <p style="color:#64748b;font-size:13px;margin-bottom:10px;">
                  Connect with me
                </p>

                <table>
                  <tr>
                    <td style="padding:5px 10px;">
                      <a href="https://linkedin.com" style="color:#22d3ee;text-decoration:none;font-size:13px;">
                        💼 LinkedIn
                      </a>
                    </td>
                    <td style="padding:5px 10px;">
                      <a href="https://github.com" style="color:#22d3ee;text-decoration:none;font-size:13px;">
                        💻 GitHub
                      </a>
                    </td>
                    <td style="padding:5px 10px;">
                      <a href="https://praveenmurugan.me" style="color:#22d3ee;text-decoration:none;font-size:13px;">
                        🌐 Portfolio
                      </a>
                    </td>
                    <td style="padding:5px 10px;">
                      <a href="https://wa.me/919489790927" style="color:#22d3ee;text-decoration:none;font-size:13px;">
                        📱 WhatsApp
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Closing -->
            <tr>
              <td style="padding:25px;text-align:center;border-top:1px solid #1e293b;">
                
                <p style="color:#cbd5e1;font-size:14px;">
                  Looking forward to connecting with you soon.
                </p>

                <p style="color:#22d3ee;font-size:16px;font-weight:bold;margin:10px 0;">
                  Praveen M
                </p>

                <!-- 
                <p style="color:#475569;font-size:12px;">
                  ✦ Full Stack Developer ✦ Open Source Enthusiast
                </p>
                -->

                <p style="color:#5b6e8c;font-size:11px;margin-top:10px;">
                  ✉️ praveen17082005@gmail.com <br/>
                  📞 +91 94897 90927
                </p>

              </td>
            </tr>

          </table>

          <!-- Footer Note -->
          <p style="margin-top:15px;font-size:11px;color:#334155;">
            This is an automated acknowledgment confirming that your message has been received via my portfolio website.
          </p>

        </td>
      </tr>
    </table>

  </div>
  `
        };


        // 🚀 Send Emails (Wrapped in try-catch to prevent 500 error on Render Free Tier SMTP block)
        try {
            await Promise.all([
                transporter.sendMail(mailOptions),
                transporter.sendMail(replyMailOptions)
            ]);
        } catch (emailErr) {
            console.error('Email sending failed (likely blocked by Render SMTP rules), but message was saved to database:', emailErr.message);
        }

        res.json({ message: 'Message sent successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 📥 GET: Admin - Fetch Messages
router.get('/', verifyToken, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ date: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ❌ DELETE: Admin - Remove Message
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;