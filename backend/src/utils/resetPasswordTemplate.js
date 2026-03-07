const resetPasswordTemplate = (link) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Recuperação de Senha</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            
            <table width="500" cellpadding="0" cellspacing="0" style="background:#111111; border-radius:12px; padding:40px; color:#ffffff;">
              
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <h2 style="color:#d4af37; margin:0;">Berjo</h2>
                </td>
              </tr>

              <tr>
                <td style="padding-bottom:20px;">
                  <p style="margin:0; font-size:16px;">
                    Recebemos uma solicitação para redefinir sua senha.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding-bottom:30px;">
                  <p style="margin:0; font-size:14px; color:#cccccc;">
                    Clique no botão abaixo para criar uma nova senha. Este link é válido por 1 hora.
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding-bottom:30px;">
                  <a href="${link}" 
                    style="
                      background-color:#d4af37;
                      color:#111111;
                      padding:12px 24px;
                      text-decoration:none;
                      border-radius:8px;
                      font-weight:bold;
                      display:inline-block;
                    ">
                    Redefinir senha
                  </a>
                </td>
              </tr>

              <tr>
                <td style="font-size:12px; color:#888888;">
                  Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
                  <br><br>
                  <span style="word-break:break-all; color:#d4af37;">
                    ${link}
                  </span>
                </td>
              </tr>

            </table>

            <table width="500" cellpadding="0" cellspacing="0" style="padding-top:15px;">
              <tr>
                <td align="center" style="font-size:12px; color:#999999;">
                  © ${new Date().getFullYear()} Berjo. Todos os direitos reservados.
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

module.exports = resetPasswordTemplate