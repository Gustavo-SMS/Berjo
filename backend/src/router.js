const express = require('express')

const userController = require("./controllers/userController")
const customerController = require("./controllers/customerController")
const orderController = require("./controllers/orderController")
const blindController = require("./controllers/blindController")
const blindTypeController = require("./controllers/blindTypeController")

const authenticateToken = require("./middlewares/authenticateToken")
const userMiddleware = require("./middlewares/userMiddleware")
const customerMiddleware = require("./middlewares/customerMiddleware")
const orderMiddleware = require("./middlewares/orderMiddleware")
const blindMiddleware = require("./middlewares/blindMiddleware")
const blindTypeMiddleware = require("./middlewares/blindTypeMiddleware")

const router = express.Router()

router.get('/', (req, res) => {
    res.send("Server running")
})

router.post('/register', authenticateToken.authenticateToken, userMiddleware.validateUserData, userController.registerUser)
router.post('/login', userMiddleware.validateLoginData, userController.validateLogin)
router.post('/logout', authenticateToken.authenticateToken, userController.logout)
router.post('/refresh', userController.refreshTokenHandler)

router.put('/users/login', authenticateToken.authenticateToken, userController.updateLogin)
router.put('/users/password', authenticateToken.authenticateToken, userController.updatePassword)

router.get('/me', authenticateToken.authenticateToken, (req, res) => {
    const { role, customerId } = req.user
    res.json({ role, customerId })
  })

router.get('/users/unlinked', userController.getUnlinkedUsers)

router.get('/customers', authenticateToken.authenticateToken, customerController.getAll)
router.get('/customers/:id', authenticateToken.authenticateToken, customerController.getOne)
router.get('/customers/name/:name', authenticateToken.authenticateToken, customerController.getCustomerByName)
router.post('/customers', authenticateToken.authenticateToken, customerMiddleware.validateCustomerData, customerController.createCustomer)
router.put('/customers', authenticateToken.authenticateToken, customerController.updateCustomer)
router.delete('/customers/:id', authenticateToken.authenticateToken, customerController.deleteCustomer)

router.get('/orders', authenticateToken.authenticateToken, orderController.getAll)
router.get('/orders/filter/', authenticateToken.authenticateToken, orderController.getOrdersByFilter)
router.get('/orders/status/:status', authenticateToken.authenticateToken, orderController.getOrdersByStatus)
router.get('/orders/customer/:id', authenticateToken.authenticateToken, orderController.getOrdersByCustomer)
router.get('/orders/:id', authenticateToken.authenticateToken, orderMiddleware.validateId, orderController.getOne)
router.post('/orders', authenticateToken.authenticateToken, orderMiddleware.totalPrice, orderController.createOrder)
router.put('/orders', authenticateToken.authenticateToken, orderController.updateOrder)
router.put('/orders/status', authenticateToken.authenticateToken, orderController.changeStatus)
router.delete('/orders/:id', authenticateToken.authenticateToken, orderController.deleteOrder)

router.get('/blinds', authenticateToken.authenticateToken, blindController.getAll)
router.post('/blinds', authenticateToken.authenticateToken, blindMiddleware.validateBlindData, blindController.createBlind)
router.put('/blinds', blindMiddleware.calculateBlindPrice, blindController.updateBlind)
router.delete('/blinds/:id', authenticateToken.authenticateToken, blindController.deleteBlind)

router.get('/blind_types', authenticateToken.authenticateToken, blindTypeController.getAll)
router.get('/blind_types/type', authenticateToken.authenticateToken, blindTypeController.getTypes)
router.get('/blind_types/type/:type', authenticateToken.authenticateToken, blindTypeController.getByType)
router.get('/blind_types/collection/:collection', authenticateToken.authenticateToken, blindTypeController.getByCollection)
router.post('/blind_types', authenticateToken.authenticateToken, blindTypeMiddleware.validateBlindTypeData, blindTypeController.createBlindType)
router.put('/blind_types', authenticateToken.authenticateToken, blindTypeController.updateBlindType)
router.delete('/blind_types/:id', authenticateToken.authenticateToken, blindTypeController.deleteBlindType)

module.exports = router