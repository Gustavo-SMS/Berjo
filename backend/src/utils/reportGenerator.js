const PdfPrinter = require('pdfmake')

const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
}

const printer = new PdfPrinter(fonts)

function generateReportPDF({ title, headers, rows, content }, res, filename = 'relatorio.pdf') {
  let finalContent = []

  if (content && Array.isArray(content)) {
    finalContent = content
  } else if (title && headers && rows) {
    finalContent = [
      { text: title, style: 'header' },
      {
        table: {
          headerRows: 1,
          widths: headers.map(() => 'auto'),
          body: [headers, ...rows],
        },
      },
    ]
  } else {
    finalContent = [{ text: 'Nenhum conteúdo fornecido.', italics: true }]
  }

  const docDefinition = {
    content: finalContent,
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        marginBottom: 10,
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
    },
    defaultStyle: {
      font: 'Helvetica',
      fontSize: 11,
    },
    pageMargins: [40, 60, 40, 60],
  }

  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`)
  pdfDoc.pipe(res)
  pdfDoc.end()
}

module.exports = generateReportPDF
