const express = require('express')

const orderController = require("./controllers/orderController")
const customerController = require("./controllers/customerController")
const userController = require("./controllers/userController")
const checkToken = require("./middlewares/validateToken")

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
router.patch('/customers', customerController.updateCustomer)
router.delete('/customers/:id', customerController.deleteCustomer)

router.get('/orders', orderController.getAll)
router.get('/orders/:id', orderController.getOne)
router.get('/orders/status/:status', orderController.getOrdersByStatus)
router.get('/orders/customer/:id', orderController.getOrdersByCustomer)
router.post('/orders', orderController.createOrder)
router.patch('/orders', orderController.updateOrder)
router.delete('/orders/:id', orderController.deleteOrder)

module.exports = router