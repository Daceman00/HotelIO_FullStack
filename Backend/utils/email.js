// utils/email.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        logger: true,
        debug: true,
    });

    // Enhanced mail options with HTML support
    const mailOptions = {
        from: 'dariomandic <dariomandic2000@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html  // Add HTML support (optional)
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;