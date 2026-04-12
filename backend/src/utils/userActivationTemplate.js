const userActivationTemplate = (activationLink) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Ativação de Conta</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0f0f0f; font-family:Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" 
            style="background-color:#1a1a1a; border-radius:12px; padding:40px; box-shadow:0 0 20px rgba(0,0,0,0.6);">

            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h1 style="color:#d4af37; margin:0; font-size:24px;">
                  Ativação de Conta
                </h1>
              </td>
            </tr>

            <tr>
              <td style="color:#ffffff; font-size:16px; line-height:1.6;">
                <p>Olá,</p>

                <p>
                  Sua conta foi criada com sucesso no sistema.
                  Para ativá-la e definir sua senha, clique no botão abaixo:
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:30px 0;">
                <a href="${activationLink}" 
                   style="
                     background-color:#d4af37;
                     color:#000000;
                     padding:14px 28px;
                     text-decoration:none;
                     border-radius:8px;
                     font-weight:bold;
                     display:inline-block;
                   ">
                  Definir Senha
                </a>
              </td>
            </tr>

            <tr>
              <td style="color:#bbbbbb; font-size:14px; line-height:1.6;">
                <p>
                  Este link é válido por <strong>24 horas</strong>.
                </p>

                <p>
                  Caso você não tenha solicitado esta conta, ignore este e-mail.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:30px; border-top:1px solid #333333; color:#777777; font-size:12px;" align="center">
                © ${new Date().getFullYear()} Seu Sistema. Todos os direitos reservados.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `
}

module.exports = userActivationTemplate