const jwt = require('jsonwebtoken')

function checkToken(req, res, next) {
    const cookies = req.cookies
    const token = cookies.token
    if(!token) {
        return res.status(404).json({ msg: 'Acesso negado!' })
    }

    try {
        const secret = process.env.JWT_SECRET

        jwt.verify(token, secret)

        next()
    } catch (err) {
        res.status(400).json({ msg: 'Token inválido!' })
    }
}

module.exports = { 
    checkToken
}