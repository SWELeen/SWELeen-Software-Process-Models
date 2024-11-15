// emailNotification.js
require('dotenv').config(); // Load environment variables from .env file
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Use environment variable


const sendWelcomeEmail = (email, username) => {
    const msg = {
        to: email,
        from: 'aleef.care@gmail.com',
        subject: 'Welcome to Aleef!',
        text: `Hello ${username},\n\nThank you for creating an account with Aleef. We're excited to help you take care of your pets!\n\nBest regards,\nThe Aleef Team`,
        html: `<p>Hello ${username},</p><p>Thank you for creating an account with Aleef. We're excited to help you take care of your pets!</p><p>Best regards,<br>The Aleef Team</p>`
    };

    return sgMail.send(msg);
}

const sendReminderEmail = (email, title, dateTime) => {
    const msg = {
        to: email,
        from: 'aleef.care@gmail.com',
        subject: `Reminder: ${title}`,
        text: `This is a reminder for your scheduled event: ${title} on ${dateTime}.`,
        html: `<p>This is a reminder for your scheduled event:</p><p><strong>${title}</strong></p><p>Scheduled for: <strong>${dateTime}</strong></p>`,
    };
    return sgMail.send(msg);
};

module.exports = { sendWelcomeEmail, sendReminderEmail };



