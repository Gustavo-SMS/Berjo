const { blindSchema } = require('../schema/validationSchema')
const { prismaClient } = require('../database/prismaClient')


const validateBlindData = async (req, res, next) => {
    const data = req.body

    try {
        const value = await blindSchema.validateAsync(data)

        const order = await checkOrderId(res, data.orderId)
        const catalogItem = await checkCatalogItemId(res, data.catalogItemId)

        if (!order) {
            return res.status(500).json({ error: "Pedido não encontrado" })
        } else if (!catalogItem) {
            return res.status(500).json({ error: "Item do catálogo não encontrado" })
        } else if (value) {
            next()
        }
    }
    catch (e) {
        return res.status(500).json({ error: e.message })
    }
}

const checkOrderId = async (res, id) => {
    try {
        const order = await prismaClient.order.findUnique({
            where: {
                id: id
            }
        })

        if (order) {
            return order
        } else {
            return undefined
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const checkCatalogItemId = async (res, id) => {
    try {
        const catalogItem = await prismaClient.catalogItem.findUnique({
            where: {
                id
            }
        })

        if (catalogItem) {
            return catalogItem
        }

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const calculateBlindPrice = async (req, res, next) => {
    const blind = req.body
    
    try {
        const squareMetre = blind.width * blind.height
        blind.square_metre = squareMetre * blind.quantity

        const blindPrice = await prismaClient.catalogItem.findUnique({
            where: { id: blind.catalogItemId },
            select: { price: true }
        })

        if (!blindPrice) throw new Error("Tipo de persiana não encontrado")

        blind.blind_price = blind.square_metre * blindPrice.price

        next()
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    validateBlindData,
    calculateBlindPrice
}