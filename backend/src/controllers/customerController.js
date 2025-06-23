const { prismaClient } = require('../database/prismaClient')
const generateReportPDF = require('../utils/reportGenerator')

const getAll = async (req, res) => {
    try {
        const customers = await prismaClient.customer.findMany({
            where: {
              isActive: true,
              OR: [
                {
                  user: {
                    role: 'CUSTOMER'
                  }
                },
                {
                  user: null
                }
              ]
            },
            include: {
              address: true
            }
          })

        if (customers.length === 0) {
            return res.status(404).json({ error: 'Nenhum cliente foi encontrado' })
        }

        return res.status(200).json(customers)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getOne = async (req, res) => {
    const id = req.params.id

    try {
        const customer = await prismaClient.customer.findUnique({
            where: {
                id,
                isActive: true
            },
            include: {
                address: true
            }
        })

        if (!customer) {
            return res.status(404).json({ error: 'Cliente não foi encontrado' })
        }

        return res.status(200).json(customer)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getCustomerByName = async (req, res) => {
    const { name = '', isActive } = req.query

    try {
        const customers = await prismaClient.customer.findMany({
            where: {
                name: {
                    contains: name,
                },
                ...(isActive !== undefined && {
                isActive: isActive === 'true'
                })
            },
            include: {
                address: true
            }
        })

        return res.status(200).json(customers)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getUnlinkedCustomers = async (req, res) => {
    try {  
        const customers = await prismaClient.customer.findMany({
            where: {
                user: null,
                isActive: true
            },
            select: {
                id: true,
                name: true
            }
        })

        return res.status(200).json(customers)
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuários não vinculados' })
    }
}

const getInactiveCustomers = async (req, res) => {
    try {
        const customers = await prismaClient.customer.findMany({
            where: {
                isActive: false
            },
            include: {
                address: true
            }
        })

        return res.status(200).json(customers)
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuários não inativos' })
    }
}

const createCustomer = async (req, res) => {
    const { name, email, phone, docNumber, street, house_number, complement, city, district, state, zip } = req.body
    
    const checkUniqueData = await prismaClient.customer.findFirst({
        where: {
            OR: [
                { email },
                { docNumber }
            ]
        }
    })

    if(checkUniqueData) {
        if(email === checkUniqueData.email) {
            return res.status(409).json({ error: 'Email já cadastrado'})
        } else if(docNumber === checkUniqueData.docNumber) {
            return res.status(409).json({ error: 'CPF/CNPJ já cadastrado'})
        }
    }
    
    try {
        const customer = await prismaClient.customer.create({
            data: {
                name,
                email,
                phone: parseInt(phone),
                docNumber,
                address: {
                    create: {
                        street,
                        house_number: parseInt(house_number),
                        complement,
                        city,
                        district,
                        state,
                        zip: parseInt(zip)
                    }
                }
            }
        })

        return res.status(201).json(customer)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const updateCustomer = async (req, res) => {
    const { id, name, email, docNumber, phone, street, house_number, complement, city, district, state, zip, debt } = req.body
 
    try {
        const customer = prismaClient.customer.update({
            where: {
                id
            },
            data: {
                name: name || undefined,
                email: email || undefined,
                docNumber: docNumber || undefined,
                phone: parseInt(phone) || undefined,
                debt: debt !== undefined ? debt : undefined
            }
        })

        const address = prismaClient.address.update({
            where: {
                customer_id: id
            },
            data: {
                street: street || undefined,
                house_number: parseInt(house_number) || undefined,
                complement: complement || undefined,
                city: city || undefined,
                district: district || undefined,
                state: state || undefined,
                zip: parseInt(zip) || undefined
            }
        })

        const transaction = await prismaClient.$transaction([customer, address])

        return res.status(201).json(transaction)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const updateDebt = async (customerId, totalPrice, newTotalPrice) => {

    try {
        const customer = await prismaClient.customer.findUnique({
            where: {
                id: customerId
            }
        })

        const newDebt = (customer.debt - totalPrice) + newTotalPrice

        const response = await prismaClient.customer.update({
            where: {
                id: customer.id
            },
            data: {
                debt: newDebt
            }
        })

        return response
    } catch (error) {
        console.log(error.message)
    }
}

const deleteCustomer = async (req, res) => {
    const id = req.params.id
    try {
        const customer = await prismaClient.customer.update({
            where: {
                id
            },
            data: {
                isActive: false
            }
        })

        return res.status(200).json(customer)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const reactivateCustomer = async (req, res) => {
    const id = req.params.id
    try {
        const customer = await prismaClient.customer.update({
            where: {
                id
            },
            data: {
                isActive: true
            }
        })

        return res.status(200).json(customer)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const generateReportByCustomer = async (req, res) => {
  const { customerId } = req.query

  const customer = await prismaClient.customer.findUnique({
    where: { id: customerId },
    include: {
      address: true,
      orders: {
        include: {
          blind: {
            include: { type: true }
          }
        },
        orderBy: { created_at: 'desc' }
      }
    }
  })

  if (!customer) return res.status(404).json({ error: 'Cliente não encontrado' })

  const content = [
    { text: `Relatório de Pedidos - ${customer.name}`, style: 'header' },
    { text: `Documento: ${customer.docNumber}` },
    { text: `Telefone: ${customer.phone}` },
    { text: `Email: ${customer.email}` },
    { text: `Criado em: ${new Date(customer.created_at).toLocaleDateString()}` },
  ]

  if (customer.address) {
    const a = customer.address
    content.push({
      text: `Endereço: ${a.street}, ${a.house_number || ''} ${a.complement || ''} - ${a.district}, ${a.city} - ${a.state}, CEP: ${a.zip}`
    })
  }

  content.push({ text: '\n' })

  if (customer.orders.length === 0) {
    content.push({ text: 'Este cliente ainda não possui pedidos.' })
  } else {
    customer.orders.forEach((order, i) => {
      content.push({ text: `Pedido ${i + 1}`, style: 'subheader' })
      content.push({ text: `Data: ${new Date(order.created_at).toLocaleDateString()}` })
      content.push({ text: `Status: ${order.status}` })
      content.push({ text: `Total: R$ ${order.total_price.toFixed(2)}\n` })

      const blindsTable = [
        [
          'Qtd', 'Tipo', 'Coleção', 'Cor', 'Medidas', 'Modelo', 'Valor'
        ]
      ]

      order.blind.forEach(b => {
        blindsTable.push([
            b.quantity,
            b.type.type,
            b.type.collection,
            b.type.color,
            `${b.width}x${b.height}cm`,
            b.model,
          `R$ ${b.blind_price.toFixed(2)}`
        ])
      })

      if (blindsTable.length > 1) {
        content.push({
          table: {
            widths: ['*', '*', '*', '*', 'auto', 'auto', 'auto'],
            body: blindsTable
          },
          margin: [0, 0, 0, 10]
        })
      }
    })
  }

  generateReportPDF({ content }, res, `relatorio_cliente_${customer.name}.pdf`)
}

module.exports = {
    getAll,
    getOne,
    getCustomerByName,
    getUnlinkedCustomers,
    getInactiveCustomers,
    createCustomer,
    updateCustomer,
    updateDebt,
    deleteCustomer,
    reactivateCustomer,
    generateReportByCustomer
}