const { validate: isUuid } = require('uuid')
const { prismaClient } = require('../database/prismaClient')

const validateId = async (req, res, next) => {
    const { id } = req.params

    if(!isUuid(id)) {
        return res.status(400).json({ error: 'ID inválido' })
    }

    try {
        const order = await prismaClient.order.findUnique({
            where: {
                id
            }
        })
        res.order = order 

        if(!order) {
            res.status(404).json({ error: 'Pedido não encontrado' })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }

    next()
}

module.exports = {
    validateId
}