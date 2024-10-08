const { prismaClient } = require('../database/prismaClient')

const getAll = async (req, res) => {
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

    return res.json(orders)
}

const getOne = async (req, res) => {
    const id = req.params.id

    const order = await prismaClient.order.findUnique({
        where: {
            id
        },
        include: {
            blind: true
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
    const { customer, blinds/*square metre*/ } = req.body
    
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

    return res.status(200).json(order)
}

const updateOrder = async (req, res) => {
    const { id, quantity, blind, width, height, command_height, model, status } = req.body

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