const { prismaClient } = require('../database/prismaClient')

const getAll = async (req, res) => {
    const orders = await prismaClient.order.findMany()

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

const createOrder = async (req, res) => {
    const { cliente, quantity, type, color, width, height, command_height, model } = req.body
    const customer_id = "307b37a5-88b6-40f7-94e0-93ee6c809570"
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
                connect: { id: customer_id }
            }
        }
    })

    return res.status(200).json(`cliente: ${cliente}, quantidade: ${quantity}, ${order}`)
}

const updateOrder = async (req, res) => {
    const { id, quantity, type, color, width, height, command_height, model  } = req.body

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
            model: model || undefined
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
    createOrder,
    updateOrder,
    deleteOrder,
}