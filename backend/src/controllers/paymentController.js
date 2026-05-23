const { prismaClient } = require('../database/prismaClient')
const { updatePendingAmount } = require('./orderController')

const createPayment = async (req, res) => {
    const { amount, date, orderId } = req.body

    const [year, month, day] = date.split('-')
    const localDate = new Date(year, month - 1, day)

    try {
        const paymentAmount = parseFloat(amount)

        const result = await prismaClient.$transaction(async (tx) => {

            const order = await tx.order.findUnique({
                where: {
                    id: orderId
                }
            })

            if (!order) {
                throw new Error('Pedido não encontrado')
            }

            if (paymentAmount > order.pending_amount) {
                throw new Error('Valor do pagamento excede o valor pendente')
            }

            const payment = await tx.payment.create({
                data: {
                    amount: paymentAmount,
                    date: localDate,
                    order: {
                        connect: {
                            id: orderId
                        }
                    }
                }
            })

            await tx.order.update({
                where: {
                    id: orderId
                },
                data: {
                    pending_amount: order.pending_amount - paymentAmount
                }
            })

            await tx.customer.update({
                where: {
                    id: order.customer_id
                },
                data: {
                    debt: {
                        decrement: paymentAmount
                    }
                }
            })

            return payment
        })

        res.status(201).json(result)

    } catch (error) {
        console.log(error.message)

        if (
            error.message === 'Pedido não encontrado' ||
            error.message === 'Valor do pagamento excede o valor pendente'
        ) {
            return res.status(400).json({
                error: error.message
            })
        }

        res.status(500).json({
            error: 'Erro ao criar pagamento'
        })
    }
}

module.exports = {
    createPayment
}