const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

async function sendEmail({ to, subject, html, text }) {
    const info = await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to,
        subject,
        html,
        text: text || ''
    })

    return info
}

module.exports = {
    sendEmail
}