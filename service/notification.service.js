const nodemailer = require('nodemailer');
const { User, Notification } = require("../models/database.model");

async function mailConfig () {
   return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.notification_user,
            pass: process.env.notification_pass,
        },
    });
}
async function sendNotification (req, res) {
     try {
            const { email, notifications } = req.body;

            const user = await User.create({ email });

            const createdNotifications = await Promise.all(
                notifications.map((text) => Notification.create({ text, userId: user.id }))
            );

            const mailOptions = {
                from: 'your_email@example.com',
                to: email,
                subject: 'New notifications added',
                text: `The following notifications were added: ${notifications.join(', ')}`,
            };

            /*Need authorize user with nodemailer to send message/
            await mailConfig().sendMail(mailOptions);*/

            return res.json({ user, notifications: createdNotifications });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
}

async function getMessages(req, res) {
    try {
        const users = await User.findAll();
        return res.json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    sendNotification,
    getMessages
}