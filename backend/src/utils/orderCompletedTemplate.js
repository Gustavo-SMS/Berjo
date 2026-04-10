const orderCompletedTemplate = ({ name, order, total_price }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8" />
  </head>

  <body style="margin:0; padding:0; background-color:#0f0f0f; font-family: Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#1a1a1a; border-radius:14px; overflow:hidden; border:1px solid rgba(212,175,55,0.2);">

            <tr>
              <td style="padding:28px; text-align:center; border-bottom:1px solid rgba(212,175,55,0.2);">
                <h1 style="color:#d4af37; margin:0; font-size:22px; letter-spacing:1px;">
                  PEDIDO CONCLUÍDO
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:32px; color:#e0e0e0;">

                <p style="margin-top:0; font-size:16px;">
                  Olá, <strong style="color:#ffffff;">${name}</strong>
                </p>

                <p style="font-size:14px; line-height:1.6; color:#bfbfbf;">
                  Seu pedido foi finalizado com sucesso.
                </p>

                <table width="100%" cellpadding="10" cellspacing="0"
                  style="border-collapse:collapse; margin-top:25px; font-size:13px;">

                  <thead>
                    <tr style="background:#141414; color:#d4af37; text-transform:uppercase; font-size:12px;">
                      <th align="left">Qtd</th>
                      <th align="left">Modelo</th>
                      <th align="left">Tipo</th>
                      <th align="left">Coleção</th>
                      <th align="left">Cor</th>
                      <th align="left">Medidas</th>
                    </tr>
                  </thead>

                  <tbody>
                    ${order.blind.map(blind => `
                      <tr style="border-bottom:1px solid #262626;">
                        <td>${blind.quantity}</td>
                        <td>${blind.model}</td>
                        <td>${blind.type.type}</td>
                        <td>${blind.type.collection}</td>
                        <td>${blind.type.color}</td>
                        <td>${blind.width} x ${blind.height}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;">
                  <tr>
                    <td style="background:#111111; padding:18px; border-radius:8px; border:1px solid rgba(212,175,55,0.25);">
                      <p style="margin:0; font-size:13px; color:#bfbfbf;">
                        Total do pedido
                      </p>
                      <p style="margin:6px 0 0 0; font-size:22px; font-weight:bold; color:#d4af37;">
                        R$ ${total_price}
                      </p>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <tr>
              <td style="padding:20px; text-align:center; font-size:11px; color:#666; border-top:1px solid #222;">
                © ${new Date().getFullYear()} Berjo persianas
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

module.exports = {
  orderCompletedTemplate
}