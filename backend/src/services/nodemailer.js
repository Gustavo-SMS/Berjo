const sendEmail = async function ({ to, subject, html, text }) {
    const payload = {
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
        textContent: text || html.replace(/<[^>]*>/g, " ")
    }

    const response = await fetch(
        "https://api.brevo.com/v3/smtp/email",
        {
            method: "POST",
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": process.env.BREVO_API_KEY
            },
            body: JSON.stringify(payload)
        }
    )

    const data = await response.json()

    if (!response.ok) {
        console.error(data)
        throw new Error(data.message || "Erro ao enviar e-mail")
    }

    return data
}

module.exports = {
    sendEmail
}