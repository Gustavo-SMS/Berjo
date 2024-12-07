const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

async function sendEmail(email, subject, blinds, totalPrice) {
    const text = JSON.stringify(blinds)
    console.log(text)
    const info = await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: subject,
        text: text + totalPrice
    })

    return info
}

module.exports = {
    sendEmail
}