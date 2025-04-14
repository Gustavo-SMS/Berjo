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

router.get('/customers', customerController.getAll)
router.get('/customers/:id', customerController.getOne)
router.get('/customers/name/:name', customerController.getCustomerByName)
router.post('/customers', customerMiddleware.validateCustomerData, customerController.createCustomer)
router.put('/customers', customerController.updateCustomer)
router.delete('/customers/:id', customerController.deleteCustomer)

router.get('/orders', orderController.getAll)
router.get('/orders/filter/', orderController.getOrdersByFilter)
router.get('/orders/status/:status', orderController.getOrdersByStatus)
router.get('/orders/customer/:id', orderController.getOrdersByCustomer)
router.get('/orders/:id', orderMiddleware.validateId, orderController.getOne)
router.post('/orders', orderMiddleware.totalPrice, orderController.createOrder)
router.put('/orders', orderController.updateOrder)
router.put('/orders/status', orderController.changeStatus)
router.delete('/orders/:id', orderController.deleteOrder)

router.get('/blinds', blindController.getAll)
router.post('/blinds', blindMiddleware.validateBlindData, blindController.createBlind)
router.put('/blinds', blindMiddleware.calculateBlindPrice, blindController.updateBlind)
router.delete('/blinds/:id', blindController.deleteBlind)

router.get('/blind_types', blindTypeController.getAll)
router.get('/blind_types/type', blindTypeController.getTypes)
router.get('/blind_types/type/:type', blindTypeController.getByType)
router.get('/blind_types/collection/:collection', blindTypeController.getByCollection)
router.post('/blind_types', blindTypeMiddleware.validateBlindTypeData, blindTypeController.createBlindType)
router.put('/blind_types', blindTypeController.updateBlindType)
router.delete('/blind_types/:id', blindTypeController.deleteBlindType)

module.exports = router