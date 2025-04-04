const { prismaClient } = require('../database/prismaClient')
const { userSchema, loginSchema } = require('../schema/validationSchema')


const validateUserData = async (req, res, next) => {
    const data = req.body

    try {
        const userExist = await prismaClient.user.findUnique({
            where: {
                login: data.login
            }
        })

        if(userExist) {
            return res.status(500).json({ error: 'Este email já está cadastrado' })
        }

        const value = await userSchema.validateAsync(data)
   
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