// utils/email.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

/* const sendEmail = async (options) => {
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
        from: 'HotelIO <HotelIO-noreply@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html  // Add HTML support (optional)
    };

    await transporter.sendMail(mailOptions);
};
 */

console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'loaded' : 'UNDEFINED');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
});


// Add this - verify connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('Gmail connection error:', error.message);
    } else {
        console.log('Gmail connection successful ✓');
    }
});


const sendEmail = async (options) => {
    const mailOptions = {
        from: `HotelIO <${process.env.GMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.email}`);
    } catch (error) {
        console.error('Gmail error:', error.message);
        throw error;
    }
};

module.exports = sendEmail;