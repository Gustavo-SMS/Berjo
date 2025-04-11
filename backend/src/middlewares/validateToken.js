const jwt = require('jsonwebtoken')

function checkToken(req, res, next) {
    const token = req.cookies.token

    if(!token) {
        return res.status(404).json({ msg: 'Token não fornecido' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = {
            id: decoded.id,
            role: decoded.role,
            customerId: decoded.customerId
          }

        next()
    } catch (err) {
        res.status(400).json({ msg: 'Token inválido ou expirado' })
    }
}

module.exports = { 
    checkToken
}