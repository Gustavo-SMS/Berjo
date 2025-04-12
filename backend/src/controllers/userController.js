const { prismaClient } = require('../database/prismaClient')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const getUnlinkedUsers = async (req, res) => {
  try {
    const users = await prismaClient.user.findMany({
      where: {
        role: 'CUSTOMER',
        customer: null,
      },
      select: {
        id: true,
        login: true
      }
    })
    
    if(users.length === 0) {
        return res.status(404).json({ error: 'Nenhum usuário foi encontrado' })
    }
    
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuários não vinculados' })
  }
}

const registerUser = async (req, res) => {
    const { login, password, confirmPassword, role } = req.body

    if(!login) {
        return res.status(422).json({ msg : 'O login é obrigatório!'})
    }

    if(!password) {
        return res.status(422).json({ msg : 'A senha é obrigatória!'})
    }

    if(password !== confirmPassword) {
        return res.status(422).json({ msg : 'As senhas não conferem!'})
    }

    const userExists = await prismaClient.user.findUnique({ 
        where: {
            login
        }
     })

    if(userExists) {
        return res.status(422).json({ msg : 'Por favor, utilize outro login!'})
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await prismaClient.user.create({
        data: {
            login,
            password: passwordHash,
            role
        }
    })

    return res.status(200).json(`Usuário criado com sucesso! ${user.login}`)
}

async function validateUser(login) {
    const user = await prismaClient.user.findUnique({
      where: { login },
      include: { customer: true }
    })
  
    if (!user) throw new Error('Usuário não encontrado')
  
    if (user.role === 'CUSTOMER' && !user.customer) {
      throw new Error('Usuário ainda não vinculado a um cliente.')
    }
  
    if (user.customer && user.customer.isActive === false) {
      throw new Error('Usuário desativado.')
    }
  
    return user
  }
  
async function validatePassword(password, hash) {
    const isValid = await bcrypt.compare(password, hash)
    if (!isValid) throw new Error('Senha incorreta.')
}

const validateLogin = async (req, res) => {
    const { login, password } = req.body

    const user = await validateUser(login)
    await validatePassword(password, user.password)

    if(!user) {
        return res.status(404).json({ msg : 'Usuário não encontrado!'})
    }

    const checkPassword = bcrypt.compareSync(password, user.password)
    
    if(!checkPassword) {
        return res.status(422).json({ msg : 'Senha incorreta!'})
    }
    
    try {
        const payload = {
                id: user.id,
                role: user.role,
                customerId: user.customer?.id || null
            }

        const secret = process.env.JWT_SECRET
        const refreshSecret = process.env.JWT_REFRESH_SECRET

        const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' })
        
        await prismaClient.user.update({
            where: { id: user.id },
            data: { refreshToken }
        })

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000 // 15min
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        })
        
        res.status(200).json({ msg: 'Autenticação realizada com sucesso' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!' })
    }
}

const refreshTokenHandler = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).json({ msg: 'Refresh token não fornecido' })
    }

    try {
        const user = await prismaClient.user.findFirst({
            where: { refreshToken }
        })

        if (!user) {
            return res.status(403).json({ msg: 'Token inválido' })
        }

        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

        const newAccessToken = jwt.sign({
            id: payload.id,
            role: payload.role,
            customerId: payload.customerId
        }, process.env.JWT_SECRET, { expiresIn: '15m' })

        res.cookie('token', newAccessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            sameSite: 'lax'
        })

        return res.status(200).json({ msg: 'Novo token gerado' })
    } catch (err) {
        console.log(err)
        return res.status(403).json({ msg: 'Refresh token inválido ou expirado' })
    }
}

const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (refreshToken) {
        await prismaClient.user.updateMany({
            where: { refreshToken },
            data: { refreshToken: null }
        })
    }

    res.clearCookie('token')
    res.clearCookie('refreshToken')

    res.status(200).json({ msg: 'Logout realizado com sucesso' })
}

module.exports = {
    getUnlinkedUsers,
    registerUser,
    validateLogin,
    refreshTokenHandler,
    logout
}