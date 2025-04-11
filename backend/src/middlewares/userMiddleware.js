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
            return res.status(500).json({ error: 'Este login já está cadastrado' })
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
    try {
        const { login } = await loginSchema.validateAsync(req.body)

        const user = await prismaClient.user.findUnique({
            where: { login },
            include: { customer: true }
          })

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' })
        }

        if (user.role === 'CUSTOMER' && !user.customer) {
            return res.status(403).json({ error: 'Usuário ainda não vinculado a um cliente.' })
        }

        if (user.customer && user.customer.isActive === false) {
            return res.status(403).json({ error: 'Usuário está desativado.' })
        }
   
        next()
    }
    catch (e) {
        return res.status(500).json({ error: e.message })
    }
}

module.exports = {
    validateUserData,
    validateLogin
}