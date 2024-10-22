const { prismaClient } = require('../database/prismaClient')

const getAll = async (req, res) => {
    try {
        const orders = await prismaClient.order.findMany({
            include: {
                customer: {
                    select: {
                        name: true
                    }
                },
                blind: true
            }
        })

        if(!order) {
            res.status(404).json({ error: 'Nenhum pedido foi encontrado' })
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
                blind: true
            }
        })

        if(!order) {
            res.status(404).json({ error: 'Pedido não encontrado' })
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
            }
        })

        if(!orders) {
            res.status(404).json({ error: 'Nenhum pedido foi encontrado' })
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
                }
            }
        })

        if(!orders) {
            res.status(404).json({ error: 'Nenhum pedido foi encontrado' })
        }

        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
   
const createOrder = async (req, res) => {
    const { customer, blinds/*square metre*/ } = req.body

    try {
        const order = await prismaClient.order.create({
            data: {
                customer: {
                    connect: { id: customer }
                },
                total_price: 100,
                blind: {
                    create: 
                        blinds
                }
            }
        })

        if(!order) {
            res.status(404).json({ error: 'Não foi possível criar o pedido' })
        }

        return res.status(201).json(order)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const updateOrder = async (req, res) => {
    const { id, quantity, blind, width, height, command_height, model, status } = req.body

    try {
        const order = await prismaClient.order.update({
            where: {
                id
            },
            data: {
                quantity: quantity || undefined,
                width: width || undefined, 
                height: height || undefined, 
                command_height: command_height || undefined, 
                model: model || undefined,
                status: status || undefined,
                blind_id: blind || undefined
            }
        })

        if(!order) {
            res.status(404).json({ error: 'Não foi possível atualizar o pedido' })
        }

        return res.status(201).json(order)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteOrder = async (req, res) => {
    const id = req.params.id

    try {
        const order = await prismaClient.order.delete({
            where: {
                id
            }
        })

        if(!order) {
            res.status(404).json({ error: 'Não foi possível excluir o pedido' })
        }

        return res.status(200).json(order)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


module.exports = {
    getAll,
    getOne,
    getOrdersByCustomer,
    getOrdersByStatus,
    createOrder,
    updateOrder,
    deleteOrder,
}