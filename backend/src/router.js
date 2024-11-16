const express = require('express')

const userController = require("./controllers/userController")
const customerController = require("./controllers/customerController")
const orderController = require("./controllers/orderController")
const blindController = require("./controllers/blindController")
const blindTypeController = require("./controllers/blindTypeController")

const checkToken = require("./middlewares/validateToken")
const orderMiddleware = require("./middlewares/orderMiddleware")

const router = express.Router()

router.get('/', (req, res) => {
    res.send("Server running")
})

router.post('/register', userController.registerUser)
router.post('/login', userController.validateLogin)

router.get('/customers', customerController.getAll)
router.get('/customers/:id', checkToken.checkToken, customerController.getOne)
router.get('/customers/name/:name', customerController.getCustomerByName)
router.post('/customers', customerController.createCustomer)
router.put('/customers', customerController.updateCustomer)
router.delete('/customers/:id', customerController.deleteCustomer)

router.get('/orders', orderController.getAll)
router.get('/orders/:id', orderMiddleware.validateId, orderController.getOne)
router.get('/orders/status/:status', orderController.getOrdersByStatus)
router.get('/orders/customer/:id', orderController.getOrdersByCustomer)
router.post('/orders', orderMiddleware.totalPrice, orderController.createOrder)
router.put('/orders', orderController.updateOrder)
router.delete('/orders/:id', orderController.deleteOrder)

router.get('/blinds', blindController.getAll)
router.post('/blinds', blindController.createBlind)
router.put('/blinds', blindController.updateBlind)
router.delete('/blinds/:id', blindController.deleteBlind)

router.get('/blind_types', blindTypeController.getAll)
router.get('/blind_types/type/:type', blindTypeController.getByType)
router.get('/blind_types/collection/:collection', blindTypeController.getByCollection)
router.post('/blind_types', blindTypeController.createBlindType)
router.put('/blind_types', blindTypeController.updateBlindType)
router.delete('/blind_types/:id', blindTypeController.deleteBlindType)

module.exports = router