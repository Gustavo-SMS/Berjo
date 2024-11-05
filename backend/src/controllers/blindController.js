const { prismaClient } = require('../database/prismaClient')

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

const calcSquareMetre = (quantity, width, height) => {
    return (width * height) * quantity
}

const createBlind = async (req, res) => {
    const { quantity, width, height, command_height, model, observation, blindTypeId, orderId } = req.body

    const square_metre = calcSquareMetre(quantity, width, height)

    try {
        const blind = await prismaClient.blind.create({
            data: {
                quantity: parseInt(quantity),
                width: parseFloat(width),
                height: parseFloat(height),
                command_height: parseFloat(command_height),
                model,
                observation,
                square_metre,
                type: {
                    connect: { id: blindTypeId }
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
    const { id, quantity, width, height, command_height, model, observation, blindTypeId, square_metre } = req.body

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
                model: model || undefined,
                observation: observation || undefined,
                square_metre: parseFloat(square_metre) || undefined,
                type_id: blindTypeId || undefined
            }
        })

        if(!blind) {
            return res.status(404).json({ error: 'Não foi possível atualizar a persiana' })
        }

        return res.status(200).json(blind)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteBlind = async (req, res) => {
    const id = req.params.id

    try {
        const blind = await prismaClient.blind.delete({
            where: {
              id
            }
          })

        if(!blind) {
            return res.status(404).json({ error: 'Não foi possível excluir a persiana' })
        }

        return res.status(200).json(blind)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getAll,
    createBlind,
    updateBlind,
    deleteBlind
}