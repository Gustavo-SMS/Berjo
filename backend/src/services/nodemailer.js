const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

async function sendEmail(name, email, subject, blinds, totalPrice) {
    tabela = gerarTabela(blinds)

    const info = await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: subject,
        html: `${name} <br /> ${tabela} <br /> ${totalPrice}`
    })

    return info
}

function gerarTabela(data) {
    let tabela = '<table border="1">';

    tabela += '<thead><tr>';

    tabela += `<th>Qtde</th>`;
    tabela += `<th>Largura</th>`;
    tabela += `<th>Altura</th>`;
    tabela += `<th>Modelo</th>`;
    tabela += `<th>Tipo</th>`;
    tabela += `<th>Coleção</th>`;
    tabela += `<th>Cor</th>`;

    tabela += '</tr></thead>';

    tabela += '<tbody>';
    data.forEach(item => {
        tabela += '<tr>';
        for (let chave in item) {
            tabela += `<td>${item[chave]}</td>`;
        }
        tabela += '</tr>';
    });
    tabela += '</tbody>';

    tabela += '</table>';

    return tabela;
}

module.exports = {
    sendEmail
}