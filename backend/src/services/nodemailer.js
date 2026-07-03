// const nodemailer = require('nodemailer')

// const transporter = nodemailer.createTransport({
//     host: "smtp-relay.brevo.com",
//     port: 587,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//     },
// })

// async function sendEmail({ to, subject, html, text }) {
//     const info = await transporter.sendMail({
//         from: process.env.SMTP_EMAIL,
//         to,
//         subject,
//         html,
//         text: text || ''
//     })

//     return info
// }

// module.exports = {
//     sendEmail
// }
async function sendEmail({ to, subject, html, text }) {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            sender: {
                email: process.env.SMTP_EMAIL
            },
            to: [
                {
                    email: to
                }
            ],
            subject,
            htmlContent: html,
            textContent: text || ""
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error(data);
        throw new Error(data.message || "Erro ao enviar e-mail");
    }

    return data;
}

module.exports = {
    sendEmail
}