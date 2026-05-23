const { catalogItemSchema } = require('../schema/validationSchema')


const validateCatalogItemData = async (req, res, next) => {
    const data = req.body

    try {
        const value = await catalogItemSchema.validateAsync(data);
    
        if(value) {
            next()
        }
    }
    catch (e) {
        return res.status(500).json({ error: e.message })
    }
}

module.exports = {
    validateCatalogItemData
}