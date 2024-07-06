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

router.get('/customer', customerController.getAll)
router.get('/customer/:id', customerController.getOne)
router.post('/customer', customerController.createCustomer)
router.post('/customer/up', customerController.updateCustomer)
router.post('/customer/del/:id', customerController.deleteCustomer)


router.get('/order', orderController.getAll)
router.get('/order/:id', orderController.getOne)
router.post('/order', orderController.createOrder)
router.post('/order/up', orderController.updateOrder)
router.post('/order/del/:id', orderController.deleteOrder)

module.exports = router