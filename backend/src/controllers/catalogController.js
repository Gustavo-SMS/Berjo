const { prismaClient } = require('../database/prismaClient')
const { capitalizeWords } = require('../utils/capitalizeText')

const getAll = async (req, res) => {
    try {
        const catalogItems = await prismaClient.catalogItem.findMany({
            where: {
                isActive: true
            }
        })

        
        if(catalogItems.length === 0) {
            return res.status(404).json({ error: 'Nenhum item foi encontrado' })
        }
        
        return res.status(200).json(catalogItems)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getTypes = async (req, res) => {
    try {
        const catalogItems = await prismaClient.catalogItem.findMany({
            where: {
                isActive: true
            },
            select: {
                type: true
              }
        })
        
        if(catalogItems.length === 0) {
            return res.status(404).json({ error: 'Nenhum tipo foi encontrado' })
        }
        
        return res.status(200).json(catalogItems)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getWithFilter = async (req, res) => {
    const { name = '', filter = 'type' } = req.query
    
    if (!['type', 'collection'].includes(filter)) {
        return res.status(400).json({ error: 'Filtro inválido. Use "type" ou "collection".' })
    }

    try {
        const catalogItems = await prismaClient.catalogItem.findMany({
        where: {
            [filter]: {
                contains: name
            },
            isActive: true
        }
        })

        if(catalogItems.length === 0) {
            return res.status(404).json({ error: 'Item não encontrado' })
        }

        return res.status(200).json(catalogItems)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getByCollection = async (req, res) => {
    const collection = req.params.collection

    try {
        const catalogItems = await prismaClient.catalogItem.findMany({
            where: {
                collection
            }
        })

        if(catalogItems.length === 0) {
            return res.status(404).json({ error: 'Coleção não encontrada' })
        }

        return res.status(200).json(catalogItems)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const checkIfItemExist = async (type, collection, color, id = null) => {
    const catalogItemExist = await prismaClient.catalogItem.findFirst({
        where: {
            AND: [
                {
                    type
                },
                {
                    collection
                },
                {
                    color
                },
                {
                    isActive: true
                },
                id ? {
                NOT: {
                    id
                }
                } : {}
            ]
        }
    })

    if(catalogItemExist) {
        throw new Error('Item já existe')
    }
}

const createCatalogItem = async (req, res) => {
    const { type, collection, color, max_width, price } = req.body

    try {
        await checkIfItemExist(type, collection, color)

        const catalogItem = await prismaClient.catalogItem.create({
            data: {
                type: capitalizeWords(type),
                collection: capitalizeWords(collection),
                color: capitalizeWords(color),
                max_width: parseFloat(max_width) || undefined,
                price: parseFloat(price)
            }
        })

        if(!catalogItem) {
            return res.status(404).json({ error: 'Não foi possível criar o item do catálogo' })
        }

        return res.status(200).json(catalogItem)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const updateCatalogItem = async (req, res) => {
    const { id, type, collection, color, max_width, price } = req.body

    try {
        await checkIfItemExist(type, collection, color, id)

        const catalogItem = await prismaClient.catalogItem.update({
            where: {
                id
            },
            data: {
                type: capitalizeWords(type) || undefined,
                collection: capitalizeWords(collection) || undefined,
                color: capitalizeWords(color) || undefined,
                max_width: parseFloat(max_width) || null,
                price: parseFloat(price) || undefined
            }
        })

        if(!catalogItem) {
            return res.status(404).json({ error: 'Não foi possível atualizar o item do catálogo' })
        }

        return res.status(200).json(catalogItem)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteCatalogItem = async (req, res) => {
    const id = req.params.id

    try {
        const catalogItem = await prismaClient.catalogItem.update({
            where: { id },
            data: { isActive: false }
          })

        if(!catalogItem) {
            return res.status(404).json({ error: 'Não foi possível excluir o item do catálogo' })
        }

        return res.status(200).json(catalogItem)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getAll,
    getTypes,
    getWithFilter,
    getByCollection,
    createCatalogItem,
    updateCatalogItem,
    deleteCatalogItem
}