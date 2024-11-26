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

        if(orders.length === 0) {
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
                blind: true
            }
        })

        if(!order) {
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
            }
        })

        if(orders.length === 0) {
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
                }
            }
        })

        if(orders.length === 0) {
            return res.status(404).json({ error: 'Nenhum pedido foi encontrado' })
        }

        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const createOrder = async (req, res) => {
    const { customer, blinds } = req.body
    
    try {
        const order = await prismaClient.order.create({
            data: {
                customer: {
                    connect: { id: customer }
                },
                total_price: req.total_price,
                blind: {
                    create: 
                        blinds
                }
            }
        })

        if(!order) {
            return res.status(404).json({ error: 'Não foi possível criar o pedido' })
        }

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

        if(!order) {S
            return res.status(404).json({ error: 'Não foi possível atualizar o pedido' })
        }

        return res.status(201).json(order)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const updateOrder = async (req, res) => {
    const { id, status, total_price } = req.body

    try {
        const order = await prismaClient.order.update({
            where: {
                id
            },
            data: {
                status: status || undefined,
                total_price: total_price || undefined
            }
        })

        if(!order) {S
            return res.status(404).json({ error: 'Não foi possível atualizar o pedido' })
        }

        return res.status(201).json(order)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteOrder = async (req, res) => {
    const id = req.params.id

    try {
        const blind = await prismaClient.blind.deleteMany({
            where: {
                order_id: id
            }
        })

        const order = await prismaClient.order.delete({
            where: {
                id
            }
        })


        const transaction = await prismaClient.$transaction([blind, order])

        if(!transaction) {
            return res.status(404).json({ error: 'Não foi possível excluir o pedido' })
        }

        return res.status(200).json(transaction)
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
    changeStatus,
    updateOrder,
    deleteOrder,
}