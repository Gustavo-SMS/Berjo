const adminOnly = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado: apenas administradores.' })
    }
    next()
  }
  
  module.exports = adminOnly