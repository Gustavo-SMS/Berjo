const { prismaClient } = require('../database/prismaClient')

const getAll = async (req, res) => {
    const orders = await prismaClient.order.findMany({
        include: {
            customer: {
                select: {
                    name: true
                }
            }
        }
    })

    return res.json(orders)
}

const getOne = async (req, res) => {
    const id = req.params.id

    const order = await prismaClient.order.findUnique({
        where: {
            id
        }
    })

    return res.json(order)
}

const getOrdersByCustomer = async (req, res) => {
    const id = req.params.id

    const orders = await prismaClient.order.findMany({
        where: {
            customer_id: id
        }
    })

    return res.json(orders)
}

const getOrdersByStatus = async (req, res) => {
    const status = req.params.status
    
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

    return res.json(orders)
}

const createOrder = async (req, res) => {
    const { customer, quantity, type, color, width, height, command_height, model } = req.body
    
    const order = await prismaClient.order.create({
        data: {
            quantity: parseInt(quantity),
            type,
            color,
            width: parseFloat(width),
            height: parseFloat(height),
            command_height: parseFloat(command_height),
            model,
            customer: {
                connect: { id: customer }
            }
        }
    })

    return res.status(200).json(order)
}

const updateOrder = async (req, res) => {
    const { id, quantity, type, color, width, height, command_height, model, status } = req.body

    const order = await prismaClient.order.update({
        where: {
            id
        },
        data: {
            quantity: quantity || undefined,
            type: type || undefined, 
            color: color || undefined, 
            width: width || undefined, 
            height: height || undefined, 
            command_height: command_height || undefined, 
            model: model || undefined,
            status: status || undefined
        }
    })

    return res.json(order)
}

const deleteOrder = async (req, res) => {
    const id = req.params.id

    const order = await prismaClient.order.delete({
        where: {
            id
        }
    })

    return res.json(order)
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