const { prismaClient } = require('../database/prismaClient')
const orderController = require('./orderController')
const customerController = require('./customerController')
const { capitalizeWords } = require('../utils/capitalizeText')

const getAll = async (req, res) => {
    try {
        const blind = await prismaClient.blind.findMany({})

        if(blind.length === 0) {
            return res.status(404).json({ error: 'Nenhuma persiana foi encontrada' })
        }
        
        return res.status(200).json(blind)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const createBlind = async (req, res) => {
    const { quantity, width, height, command_height, model, square_metre, blind_price, catalogItemId, orderId } = req.body

    try {
        const blind = await prismaClient.blind.create({
            data: {
                quantity: parseInt(quantity),
                width: parseFloat(width),
                height: parseFloat(height),
                command_height: parseFloat(command_height),
                model: capitalizeWords(model),
                square_metre: parseFloat(square_metre),
                blind_price: parseFloat(blind_price),
                catalogItem: {
                    connect: { id: catalogItemId }
                },
                order: {
                    connect: { id: orderId }
                }
            }
        })

        if(!blind) {
            return res.status(404).json({ error: 'Não foi possível criar a persiana' })
        }

        return res.status(200).json(blind)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const updateBlind = async (req, res) => {
    const { id, quantity, width, height, command_height, model, square_metre, blind_price, catalogItemId } = req.body

    try {
        const blind = await prismaClient.blind.update({
            where: {
                id
            },
            data: {
                quantity: parseInt(quantity) || undefined,
                width: parseFloat(width) || undefined,
                height: parseFloat(height) || undefined,
                command_height: parseFloat(command_height) || undefined,
                model: capitalizeWords(model) || undefined,
                square_metre: parseFloat(square_metre) || undefined,
                blind_price: parseFloat(blind_price) || undefined,
                catalogItem: {
                    connect: { id: catalogItemId }
                }
            }
        })

        if(!blind) {
            return res.status(404).json({ error: 'Não foi possível atualizar a persiana' })
        }

        await orderController.recalculateOrderValues(blind.order_id)

        return res.status(200).json(blind)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteBlind = async (req, res) => {
    const id = req.params.id

    try {
        const blind = await prismaClient.blind.findUnique({
            where: {
                id
            },
            include: {
                order: true
            }
        })

        if (!blind) {
            return res.status(404).json({
                error: 'Persiana não encontrada'
            })
        }

        await prismaClient.blind.delete({
            where: {
                id
            }
        })

        const remainingBlinds = await prismaClient.blind.findMany({
            where: {
                order_id: blind.order_id
            }
        })

        if (remainingBlinds.length === 0) {
            await prismaClient.payment.deleteMany({
                where: {
                    order_id: blind.order_id
                }
            })

            await prismaClient.order.delete({
                where: {
                    id: blind.order_id
                }
            })

            await customerController.recalculateCustomerDebt(
                blind.order.customer_id
            )
        } else {
            await orderController.recalculateOrderValues(
                blind.order_id
            )
        }

        return res.status(200).json({
            message: 'Persiana removida com sucesso'
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    getAll,
    createBlind,
    updateBlind,
    deleteBlind
}