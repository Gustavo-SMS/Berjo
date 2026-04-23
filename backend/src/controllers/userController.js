const { prismaClient } = require('../database/prismaClient')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { sendEmail } = require('../services/nodemailer')
const resetPasswordTemplate = require('../utils/resetPasswordTemplate')
const userActivationTemplate = require('../utils/userActivationTemplate')

const validateCurrentPassword = async (userId, currentPassword) => {
  const user = await prismaClient.user.findUnique({ where: { id: userId } })

  if (!user) {
    throw new Error('Usuário não encontrado.')
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

  if (!isPasswordValid) {
    throw new Error('Senha atual incorreta.')
  }

  return user
}

const updateLogin = async (req, res) => {
  const userId = req.user.id
  const { newLogin, currentPassword } = req.body

  if (!newLogin || !currentPassword) {
    return res.status(400).json({ error: 'Login e senha atual são obrigatórios.' })
  }

  try {
    await validateCurrentPassword(userId, currentPassword)

    const existingUser = await prismaClient.user.findUnique({
      where: { login: newLogin }
    })

    if (existingUser) {
      return res.status(409).json({ error: 'Esse login já está em uso.' })
    }

    await prismaClient.user.update({
      where: { id: userId },
      data: { login: newLogin }
    })

    return res.status(200).json({ message: 'Login atualizado com sucesso.' })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const updatePassword = async (req, res) => {
  const userId = req.user.id

  const { currentPassword, newPassword, confirmPassword } = req.body

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' })
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'As novas senhas não coincidem.' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' })
  }

  try {
    await validateCurrentPassword(userId, currentPassword)

    const salt = await bcrypt.genSalt(12)
    const hashedNewPassword = await bcrypt.hash(newPassword, salt)

    await prismaClient.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    })

    return res.status(200).json({ message: 'Senha atualizada com sucesso.' })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const registerUser = async (req, res) => {
  const { login, customerId } = req.body

  if (!login) {
    return res.status(422).json({ error: 'O login é obrigatório!' })
  }

  const userExists = await prismaClient.user.findUnique({
    where: { login }
  })

  if (userExists) {
    return res.status(422).json({ error: 'Por favor, utilize outro login!' })
  }

try {
    const tempPassword = crypto.randomBytes(8).toString('hex')
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(tempPassword, salt)

    const token = crypto.randomBytes(32).toString('hex')
    const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

    const user = await prismaClient.user.create({
      data: {
        login,
        password: passwordHash,
        isActive: false,
        mustChangePassword: true,
        passwordResetToken: token,
        passwordResetExpires: expiration,
        customer: {
          connect: { id: customerId }
        }
      },
      include: { customer: true }
    })
    const link = `${process.env.FRONTEND_URL}/resetPassword?token=${token}`

    await sendEmail({
      to: user.customer.email,
      subject: 'Ativação de Conta',
      html: userActivationTemplate(link, user.customer.name, user.login)
    })

    return res.status(201).json({
      msg: 'Usuário criado com sucesso! Link de ativação enviado.'
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao criar usuário.' })
  }
}

async function validateUser(login) {
  try {
    const user = await prismaClient.user.findFirst({
      where: {
        OR: [
          { login },
          { customer: { email: login } }
        ]
      },
      include: { customer: true }
    })

    if (!user) return { error: 'Usuário não encontrado' }

    if (!user.isActive) {
      return { error: "Conta ainda não ativada." }
    }

    if (user.role === 'CUSTOMER' && !user.customer) {
      return { error: 'Usuário ainda não vinculado a um cliente.' }
    }

    if (user.customer && user.customer.isActive === false) {
      return { error: 'Usuário desativado.' }
    }

    return user
  } catch (err) {
    console.error('Erro ao validar usuário:', err.message)
    return { error: 'Erro ao validar usuário.' }
  }
}

async function validatePassword(password, hash) {
  try {
    const isValid = await bcrypt.compare(password, hash)
    return isValid
  } catch (error) {
    console.error('Erro ao validar senha:', error.message)
    return false
  }
}

const validateLogin = async (req, res) => {
  const { login, password } = req.body

  const user = await validateUser(login)

  if (user.error) {
    return res.status(404).json({ error: user.error })
  }

  const checkPassword = await validatePassword(password, user.password)

  if (!checkPassword) {
    return res.status(422).json({ error: 'Login ou senha incorretos' })
  }

  try {
    const payload = {
      id: user.id,
      role: user.role,
      customerId: user.customer?.id || null,
      jti: uuidv4()
    }

    const secret = process.env.JWT_SECRET
    const refreshSecret = process.env.JWT_REFRESH_SECRET

    const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' })
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' })

    await prismaClient.user.update({
      where: { id: user.id },
      data: { refreshToken }
    })

    res.status(200).json({
      msg: 'Autenticação realizada com sucesso',
      accessToken,
      refreshToken,
      role: user.role,
      customerId: user.customer?.id || null
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Aconteceu um erro no servidor, tente novamente mais tarde!' })
  }
}

const recoverPassword = async (req, res) => {
  try {
    const { email } = req.body
    
    const customer = await prismaClient.customer.findUnique({
      where: { email },
      include: { user: true }
    })

    if (!customer || !customer.user) {
      return res.status(200).json({ error: 'Link enviado para o email informado' })
    }

    if (!customer.user.isActive) {
      return res.status(400).json({ error: 'Conta ainda não ativada.' })
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    await prismaClient.user.update({
      where: { id: customer.user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expiration,
      }
    })

    const link = `${process.env.FRONTEND_URL}/resetPassword?token=${token}`

    try {
      await sendEmail({
        to: email,
        subject: 'Recuperação de Senha',
        html: resetPasswordTemplate(link)
      })
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error)
        return res.status(500).json({ error: 'Erro ao enviar o e-mail de recuperação.' })
    }

    return res.status(200).json({ msg: 'Link de recuperação enviado para o e-mail.' })
  } catch (err) {
    console.error('Erro em recoverPassword:', err)
    return res.status(500).json({ error: 'Erro interno ao tentar recuperar a senha.' })
  }
}

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        passwordResetToken: token
      },
      include: { customer: true }
    })

    if (!user) {
      return res.status(400).json({ 
        error: 'Token inválido ou expirado.'
      })
    }
    if(user.passwordResetExpires < new Date()) {
      return res.status(400).json({ error: 'Token expirado. Por favor, solicite um novo link de recuperação.',
        email: user.customer.email || null
      })
    }

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        isActive: true,
        mustChangePassword: false
      }
    })

    return res.status(200).json({ msg: 'Senha redefinida com sucesso!' })
  } catch (error) {
    return res.status(500).json({ message: 'Erro na alteração da senha' })
  }
}

const resendResetPassword = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      message: 'Requisição inválida'
    })
  }

  try {
    const customer = await prismaClient.customer.findUnique({
      where: { email },
      include: { user: true }
    })

    if (!customer || !customer.user) {
      return res.status(200).json({
        message: 'Não foi possível reenviar o email'
      })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 1000 * 60 * 15) // 15 minutos

    await prismaClient.user.update({
      where: { id: customer.user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: expires
      }
    })

    const link = `${process.env.FRONTEND_URL}/resetPassword?token=${resetToken}`

    await sendEmail({
      to: email,
      subject: customer.user.isActive ? "Recuperação de senha" : 'Ativação de conta',
      html: customer.user.isActive ? resetPasswordTemplate(link) : userActivationTemplate(link)
    })
    
    return res.status(200).json({ message: 'Se o email estiver cadastrado, um novo link foi enviado.'})
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    return res.status(500).json({ message: 'Erro ao enviar o e-mail de recuperação' })
  }
}

const doLogout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (refreshToken) {
    await prismaClient.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: null }
    })
  }

  const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }

  res.clearCookie('token', cookieOptions)
  res.clearCookie('refreshToken', cookieOptions)

  res.status(200).json({ msg: 'Logout realizado com sucesso' })
}

module.exports = {
  updateLogin,
  updatePassword,
  registerUser,
  validateLogin,
  recoverPassword,
  resetPassword,
  resendResetPassword,
  doLogout
}