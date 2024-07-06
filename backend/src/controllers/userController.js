const { prismaClient } = require('../database/prismaClient')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    const { login, password, confirmPassword } = req.body

    if(!login) {
        return res.status(422).json({ msg : 'O login é obrigatório!'})
    }

    if(!password) {
        return res.status(422).json({ msg : 'A senha é obrigatória!'})
    }

    if(password !== confirmPassword) {
        return res.status(422).json({ msg : 'As senhas não conferem!'})
    }

    //Checar usuário
    const userExists = await prismaClient.user.findUnique({ 
        where: {
            login
        }
     })

    if(userExists) {
        return res.status(422).json({ msg : 'Por favor, utilize outro e-mail!'})
    }

    //Criar senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //Criar usuário
    const user = await prismaClient.user.create({
        data: {
            login,
            password: passwordHash
        }
    })

    return res.status(200).json(`Usuário criado com sucesso! ${user.login} - ${user.password}`)
}

const validateLogin = async (req, res) => {
    const { login, password } = req.body

    if(!login) {
        return res.status(422).json({ msg : 'O login é obrigatório!'})
    }

    if(!password) {
        return res.status(422).json({ msg : 'A senha é obrigatória!'})
    }

    //Checar usuário
    const userExists = await prismaClient.user.findUnique({ 
        where: {
            login
        }
     })

    if(!userExists) {
        return res.status(404).json({ msg : 'Usuário não encontrado!'})
    }

    //Checar senha
    const checkPassword = bcrypt.compareSync(password, userExists.password, (err, result) => {})
    
    if(!checkPassword) {
        return res.status(422).json({ msg : 'Senha incorreta!'})
    }


    try {
        const secret = process.env.SECRET

        const token = jwt.sign(
            {
                id: userExists._id
            },
            secret
            )

        res.status(200).json({ msg: 'Autenticação realizada com sucesso', token })
    } catch (err) {
        console.log(err)

        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!' })
    }
}

module.exports = {
    registerUser,
    validateLogin
}