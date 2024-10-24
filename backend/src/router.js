const express = require('express')

const userController = require("./controllers/userController")
const customerController = require("./controllers/customerController")
const orderController = require("./controllers/orderController")
const blindController = require("./controllers/blindController")

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

router.get('/blinds', blindController.getAll)
router.get('/blinds/type/:type', blindController.getByType)
router.get('/blinds/collection/:collection', blindController.getByCollection)
router.post('/blinds', blindController.createBlind)
router.put('/blinds', blindController.updateBlind)
router.delete('/blinds/:id', blindController.deleteBlind)

router.get('/orders', orderController.getAll)
router.get('/orders/:id', orderMiddleware.validateId, orderController.getOne)
router.get('/orders/status/:status', orderController.getOrdersByStatus)
router.get('/orders/customer/:id', orderController.getOrdersByCustomer)
router.post('/orders', orderController.createOrder)
router.put('/orders', orderController.updateOrder)
router.delete('/orders/:id', orderController.deleteOrder)

module.exports = router