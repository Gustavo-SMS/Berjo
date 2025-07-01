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
            },
            orderBy: {
                name: 'asc'
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
        const where = {
            name: {
                contains: name,
            },
        }

        if (isActive === 'true' || isActive === 'false') {
            where.isActive = isActive === 'true'
        }

        const customers = await prismaClient.customer.findMany({
            where,
            include: {
                address: true
            },
            orderBy: {
                name: 'asc'
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
            },
            orderBy: {
                name: 'asc'
            }
        })

        return res.status(200).json(customers)
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuários não inativos' })
    }
}

const checkUniqueData = async (email, docNumber, id = null) => {

    const customerExist = await prismaClient.customer.findFirst({
        where: {
        AND: [
            {
            OR: [
                { email },
                { docNumber }
            ]
            },
            id ? {
            NOT: {
                id
            }
            } : {}
        ]
        }
    })

    if(customerExist) {
        if(email && email === customerExist.email) {
            throw new Error('Email já cadastrado')
        } else if(docNumber && docNumber === customerExist.docNumber) {
            throw new Error('CPF/CNPJ já cadastrado')
        }
    }
} 

const createCustomer = async (req, res) => {
    const { name, email, phone, docNumber, street, house_number, complement, city, district, state, zip } = req.body
    
    try {
        await checkUniqueData(email, docNumber)

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
        await checkUniqueData(email, docNumber, id)

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

const deactivateCustomer = async (req, res) => {
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

const deleteCustomer = async (req, res) => {
    const customerId = req.params.id

    try {
        const customer = await prismaClient.customer.findUnique({
            where: { id: customerId },
        })

        if (!customer) {
            throw new Error('Cliente não encontrado.');
        }

        if (customer.isActive) {
            throw new Error('Cliente ainda está ativo. Desative antes de excluir permanentemente.');
        }
        
        const result = await prismaClient.$transaction(async (tx) => {
            await tx.blind.deleteMany({
                where: {
                    order: {
                        customer_id: customer.id,
                    },
                },
            })

            await tx.order.deleteMany({
                where: {
                    customer_id: customer.id,
                },
            })

            await tx.address.deleteMany({
                where: {
                    customer_id: customer.id,
                },
            })

            await tx.user.deleteMany({
                where: {
                    customerId: customer.id,
                },
            })

            return await tx.customer.delete({
                where: {
                    id: customer.id,
                },
            })
        })

        return res.status(201).json(result)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const generateReportByCustomer = async (req, res) => {
  const { customerId, startDate, endDate } = req.query

  if (!customerId || !startDate || !endDate) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes: customerId, startDate, endDate' })
  }

  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T23:59:59.999`)

  try {
    const customer = await prismaClient.customer.findUnique({
      where: { id: customerId },
      include: {
        address: true,
        orders: {
          where: {
            created_at: {
              gte: start,
              lte: end
            }
          },
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
    { text: `Período: ${start.toLocaleDateString()} até ${end.toLocaleDateString()}`, margin: [0, 10, 0, 10] }
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
            `${b.width}x${b.height}`,
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

  } catch (error) {
    console.error('Erro ao gerar relatório do cliente:', error)
    res.status(500).json({ error: 'Erro interno ao gerar relatório' })
  }
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
    deactivateCustomer,
    reactivateCustomer,
    deleteCustomer,
    generateReportByCustomer
}