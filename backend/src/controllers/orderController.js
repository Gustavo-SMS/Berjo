const { prismaClient } = require('../database/prismaClient')
const { sendEmail } = require('../services/nodemailer')
const { orderCompletedTemplate } = require("../utils/orderCompletedTemplate.js")
const { calculateTotalPrice } = require("../utils/priceCalculator")
const customerController = require('./customerController')
const generateReportPDF = require('../utils/reportGenerator')

const getAll = async (req, res) => {
    try {
        const orders = await prismaClient.order.findMany({
            include: {
                customer: {
                    select: {
                        name: true
                    }
                },
                blind: {
                    include: {
                        catalogItem: {
                            select: {
                                id: true,
                                type: true,
                                collection: true,
                                color: true
                            }
                        }
                    }

                },
                payments: {
                    select: {
                        amount: true,
                        date: true
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                }
            }
        })

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Nenhum pedido foi encontrado' })
        }

        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getOne = async (req, res) => {
    const id = req.params.id

    try {
        const order = await prismaClient.order.findUnique({
            where: {
                id
            },
            include: {
                customer: {
                    select: {
                        name: true
                    }
                },
                blind: {
                    include: {
                        catalogItem: {
                            select: {
                                id: true,
                                type: true,
                                collection: true,
                                color: true
                            }
                        }
                    }

                },
                payments: {
                    select: {
                        amount: true,
                        date: true
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                }
            }
        })

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' })
        }

        return res.status(200).json(order)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getOrdersByCustomer = async (req, res) => {
    const id = req.params.id

    try {
        const orders = await prismaClient.order.findMany({
            where: {
                customer_id: id
            },
            include: {
                customer: {
                    select: {
                        name: true
                    }
                },
                blind: {
                    include: {
                        catalogItem: {
                            select: {
                                id: true,
                                type: true,
                                collection: true,
                                color: true
                            }
                        }
                    }
                },
                payments: {
                    select: {
                        amount: true,
                        date: true
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                }
            }
        })

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Nenhum pedido foi encontrado' })
        }

        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getOrdersByCustomerName = async (req, res) => {
    const { name = '', status } = req.query

    try {
        const orders = await prismaClient.order.findMany({
        where: {
            customer: {
                name: {
                    contains: name
                }
            },
            ...(status && { status })
        },
        include: {
            customer: {
                select: {
                    name: true
                }
            },
            blind: {
                include: {
                    catalogItem: {
                        select: {
                            id: true,
                            type: true,
                            collection: true,
                            color: true
                        }
                    }
                }
            },
            payments: {
                select: {
                    amount: true,
                    date: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            }
        },
            orderBy: {
                created_at: 'asc'
            }
        })

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Nenhum pedido foi encontrado' })
        }

        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getOrdersByStatus = async (req, res) => {
    const status = req.params.status

    try {
        const orders = await prismaClient.order.findMany({
            where: {
                status
            },
            include: {
                customer: {
                    select: {
                        name: true
                    }
                },
                blind: {
                    include: {
                        catalogItem: {
                            select: {
                                id: true,
                                type: true,
                                collection: true,
                                color: true
                            }
                        }
                    }

                },
                payments: {
                    select: {
                        amount: true,
                        date: true
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                }
            },
            orderBy: {
                created_at: 'asc'
            }
        })

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Nenhum pedido foi encontrado' })
        }

        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getOrdersByFilter = async (req, res) => {
    const { status, customerId } = req.query

    try {
        const isCompleted = status === 'Concluído'
        const limit = 30

        const orders = await prismaClient.order.findMany({
            where: {
                AND: [
                    { customer_id: customerId },
                    { status: status }
                ]
            },
            include: {
                customer: {
                    select: {
                        name: true
                    }
                },
                blind: {
                    include: {
                        catalogItem: {
                            select: {
                                id: true,
                                type: true,
                                collection: true,
                                color: true
                            }
                        }
                    }

                },
                payments: {
                    select: {
                        amount: true,
                        date: true
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            },
            ...(isCompleted && { take: limit })
        })

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Nenhum pedido foi encontrado' })
        }

        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getPendingPaymentOrders = async (req, res) => {
    const customerId = req.params.customerId
    
    try {
        const orders = await prismaClient.order.findMany({
            where: {
                customer_id: customerId,
                pending_amount: {
                    gt: 0
                }
            },
            include: {
                customer: {
                    select: {
                        name: true
                    }
                },
                blind: {
                    include: {
                        catalogItem: {
                            select: {
                                id: true,
                                type: true,
                                collection: true,
                                color: true
                            }
                        }
                    }

                },
                payments: {
                    select: {
                        amount: true,
                        date: true
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            },
        })

        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const createOrder = async (req, res) => {
    const { customer, blinds, observation } = req.body
    const total_price = req.total_price
    try {
        const order = await prismaClient.order.create({
            data: {
                customer: {
                    connect: { id: customer }
                },
                observation,
                total_price,
                pending_amount: total_price,
                blind: {
                    create:
                        blinds
                }
            }
        })
        if (!order) {
            return res.status(404).json({ error: 'Não foi possível criar o pedido' })
        }

        const getCustomer = await prismaClient.customer.findUnique({
            where: {
                id: order.customer_id
            }
        })

        const newDebt = getCustomer.debt + total_price
        await prismaClient.customer.update({
            where: {
                id: getCustomer.id
            },
            data: {
                debt: newDebt
            }
        })

        return res.status(201).json(order)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const changeStatus = async (req, res) => {
    const { id, status } = req.body

    try {
        const order = await prismaClient.order.update({
            where: {
                id
            },
            data: {
                status: status || undefined
            }
        })

        if (!order) {
            return res.status(404).json({ error: 'Não foi possível atualizar o pedido' })
        }

        if (status === "Concluído" && status) {
            createMail(id)
        }

        return res.status(201).json(order)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const createMail = async (id) => {
    const order = await getBlindsToMail(id)

    const name = order.customer.name
    const email = order.customer.email
    const total_price = parseFloat(order.total_price).toFixed(2)
    const pending_amount = parseFloat(order.pending_amount).toFixed(2)

    const html = orderCompletedTemplate({
        name,
        order,
        total_price,
        pending_amount
    })

    await sendEmail({
        to: email,
        subject: 'Pedido pronto',
        html,
    })
}

const getBlindsToMail = async (id) => {
    try {
        const order = await prismaClient.order.findUnique({
            where: {
                id
            },
            select: {
                total_price: true,
                pending_amount: true,
                customer: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                blind: {
                    select: {
                        quantity: true,
                        width: true,
                        height: true,
                        model: true,
                        catalogItem: {
                            select: {
                                type: true,
                                collection: true,
                                color: true
                            }
                        }
                    }
                }
            }
        })

        return order
    } catch (error) {
        return error.message
    }
}

const updateOrder = async (req, res) => {
    const { id, status, total_price, observation } = req.body

    try {
        const order = await prismaClient.order.update({
            where: {
                id
            },
            data: {
                status: status || undefined,
                total_price: total_price || undefined,
                observation: observation || null
            }
        })

        if (!order) {
            return res.status(404).json({ error: 'Não foi possível atualizar o pedido' })
        }

        return res.status(201).json(order)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const recalculateOrderValues = async (orderId) => {
    const order = await prismaClient.order.findUnique({
        where: {
            id: orderId
        }
    })

    if (!order) {
        throw new Error('Pedido não encontrado')
    }

    const blinds = await prismaClient.blind.findMany({
        where: {
            order_id: orderId
        }
    })

    const totalPrice = blinds.reduce((sum, blind) => sum + Number(blind.blind_price), 0)

    const payments = await prismaClient.payment.aggregate({
        where: {
            order_id: orderId
        },
        _sum: {
            amount: true
        }
    })

    const totalPaid = payments._sum.amount || 0

    const pendingAmount = Math.max(totalPrice - totalPaid, 0)

    const updatedOrder = await prismaClient.order.update({
        where: {
            id: orderId
        },
        data: {
            total_price: totalPrice,
            pending_amount: pendingAmount
        }
    })

    await customerController.recalculateCustomerDebt(order.customer_id)

    return updatedOrder
}

const deleteOrder = async (req, res) => {
    const id = req.params.id

    try {
        const order = await prismaClient.order.findUnique({
                where: { id }
            })

        if (!order) throw new Error("Pedido não encontrado")

        const transaction = await prismaClient.$transaction(async (tx) => {
            await tx.blind.deleteMany({
                where: { order_id: id }
            })

            await tx.payment.deleteMany({
                where: { order_id: id }
            })

            await tx.order.delete({
                where: { id }
            })
        })
        
        await customerController.recalculateCustomerDebt(
            order.customer_id
        )

        return res.status(200).json({message: "Pedido excluído com sucesso"})
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

async function generateReportByPeriod(req, res) {
  const { startDate, endDate } = req.query

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Informe data inicial e data final no formato ISO' })
  }

    const start = new Date(`${startDate}T00:00:00`)
    const end = new Date(`${endDate}T23:59:59`)

  try {
    const orders = await prismaClient.order.findMany({
      where: {
        created_at: {
          gte: start,
          lte: end,
        },
      },
      include: {
        customer: true,
        blind: {
          include: {
            catalogItem: true
          }
        },
      },
      orderBy: { created_at: 'asc' }
    })

    const content = [
      { text: `Relatório de Pedidos por Período`, style: 'header' },
      { text: `Período: ${start.toLocaleDateString('pt-BR')} até ${end.toLocaleDateString('pt-BR')}`, margin: [0, 0, 0, 10] }
    ]

    if (orders.length === 0) {
      content.push({ text: 'Nenhum pedido encontrado no período selecionado.' })
    } else {
      orders.forEach((order, index) => {
        content.push({ text: `Pedido ${index + 1}`, style: 'subheader' })
        content.push({ text: `Cliente: ${order.customer.name}` })
        content.push({ text: `Status: ${order.status}` })
        content.push({ text: `Data: ${new Date(order.created_at).toLocaleDateString('pt-BR')}` })
        content.push({ text: `Total: R$ ${order.total_price.toFixed(2)}\n` })
        content.push({ text: `Pendente: R$ ${order.pending_amount.toFixed(2)}\n` })

        const blindsTable = [
          ['Qtd', 'Tipo', 'Coleção', 'Cor', 'Medidas', 'Modelo', 'Valor']
        ]

        order.blind.forEach(b => {
          blindsTable.push([
              b.quantity.toString(),
              b.catalogItem.type,
              b.catalogItem.collection,
              b.catalogItem.color,
              `${b.width}x${b.height}`,
              b.model,
              `R$ ${b.blind_price.toFixed(2)}`
          ])
        })

        if (blindsTable.length > 1) {
          content.push({
            table: {
              widths: ['auto', '*', '*', '*', 'auto', 'auto', 'auto'],
              body: blindsTable
            },
            margin: [0, 0, 0, 10]
          })
        }
      })
    }

    generateReportPDF({ content }, res, 'relatorio-pedidos-periodo.pdf')

  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    res.status(500).json({ error: 'Erro interno ao gerar relatório' })
  }
}

module.exports = {
    getAll,
    getOne,
    getOrdersByCustomer,
    getOrdersByCustomerName,
    getOrdersByStatus,
    getOrdersByFilter,
    getPendingPaymentOrders,
    createOrder,
    changeStatus,
    updateOrder,
    recalculateOrderValues,
    deleteOrder,
    generateReportByPeriod
}