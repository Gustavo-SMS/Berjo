const { prismaClient } = require('../database/prismaClient')

const getAll = async (req, res) => {
    const blinds = await prismaClient.blind_Type.findMany({})

    return res.json(blinds)
}

const getByType = async (req, res) => {
    const type = req.params.type

    const blind = await prismaClient.blind_Type.findMany({
        where: {
            type
        }
    })

    return res.json(blind)
}

const getByCollection = async (req, res) => {
    const collection = req.params.collection

    const blind = await prismaClient.blind_Type.findMany({
        where: {
            collection
        }
    })

    return res.json(blind)
}

const createBlind = async (req, res) => {
    const { type, collection, color, max_width, price } = req.body
    
    const blind = await prismaClient.blind_Type.create({
        data: {
            type,
            collection,
            color,
            max_width: parseFloat(max_width) || undefined,
            price: parseFloat(price)
        }
    })

    return res.json(blind)
}

const updateBlind = async (req, res) => {
    const { id, type, collection, color, max_width, price } = req.body
    
    const blind = await prismaClient.blind_Type.update({
        where: {
            id
        },
        data: {
            type: type || undefined,
            collection: collection || undefined,
            color: color || undefined,
            max_width: parseFloat(max_width) || undefined,
            price: parseFloat(price) || undefined
        }
    })

    return res.json(blind)
}

const deleteBlind = async (req, res) => {
    const id = req.params.id

    const blind = await prismaClient.blind_Type.delete({
        where: {
          id
        }
      })

    return res.json(blind)
}

module.exports = {
    getAll,
    getByType,
    getByCollection,
    createBlind,
    updateBlind,
    deleteBlind
}