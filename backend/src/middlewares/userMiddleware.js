const { userSchema, loginSchema } = require('../schema/validationSchema')


const validateUserData = async (req, res, next) => {
    const data = req.body

    try {
        const value = await userSchema.validateAsync(data);
   
        if(value) {
            next()
        }
    }
    catch (e) {
        return res.status(500).json({ error: e.message })
    }
}

const validateLogin = async (req, res, next) => {
    const data = req.body

    try {
        const value = await loginSchema.validateAsync(data);
   
        if(value) {
            next()
        }
    }
    catch (e) {
        return res.status(500).json({ error: e.message })
    }
}

module.exports = {
    validateUserData,
    validateLogin
}