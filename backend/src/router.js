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

// //Rota privada
// router.get('/customer/:id', checkToken, async (req, res) => {
//     const id = req.params.id

//     const customer = await customerController.getOne(id)

//     if(!customer) {
//         return res.status(404).json({ msg: 'Usuário não encontrado!' })
//     }
// })

router.get('/customers', customerController.getAll)
router.get('/customers/:id', customerController.getOne)
router.post('/customers', customerController.createCustomer)
router.post('/customers/up', customerController.updateCustomer)
router.post('/customers/del/:id', customerController.deleteCustomer)


router.get('/orders', orderController.getAll)
router.get('/orders/:id', orderController.getOne)
router.post('/orders', orderController.createOrder)
router.post('/orders/up', orderController.updateOrder)
router.post('/orders/del/:id', orderController.deleteOrder)

module.exports = router