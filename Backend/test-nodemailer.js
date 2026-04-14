require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Test NodeMailer`,
    text: `Test successful.`
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
