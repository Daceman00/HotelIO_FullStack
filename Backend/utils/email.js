// utils/email.js
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

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
    const msg = {
        to: options.email,
        from: {
            email: process.env.SENDGRID_FROM_EMAIL,
            name: 'HotelIO'
        },
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    try {
        await sgMail.send(msg);
        console.log(`Email sent successfully to ${options.email}`);
    } catch (error) {
        console.error('SendGrid error:', error.response.body.errors || error.message);
        throw error;
    }
};

module.exports = sendEmail;