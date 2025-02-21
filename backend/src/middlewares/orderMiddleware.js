const { validate: isUuid } = require('uuid')
const { prismaClient } = require('../database/prismaClient')

const validateId = async (req, res, next) => {
    const { id } = req.params

    if (!isUuid(id)) {
        return res.status(400).json({ error: 'ID inválido' })
    }

    try {
        const order = await prismaClient.order.findUnique({
            where: {
                id
            }
        })
        res.order = order

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }

    next()
}

const totalPrice = async (req, res, next) => {
    const { blinds } = req.body
    let totalPrice = 0
    try {
        for (const blind of blinds) {
            const squareMetre = blind.width * blind.height
            blind.square_metre = squareMetre * blind.quantity

            const blindPrice = await prismaClient.blind_Type.findUnique({
                where: {
                    id: blind.blindTypeId
                },
                select: {
                    price: true
                }
            })
      
            totalPrice += blind.square_metre * blindPrice.price
        }

        req.total_price = totalPrice

        next()
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }

}

module.exports = {
    validateId,
    totalPrice
}