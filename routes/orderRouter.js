const router = require('express').Router()
const orderController= require('../controllers/orderController')
const auth = require('../auth/auth')
const authAdmin = require('../auth/authAdmin')


router.post('/', auth, orderController.newOrder)
router.get('/:id', auth, orderController.getOrderByUserId)
router.put('/:id', auth, orderController.updateOrder)
router.delete('/:id', auth, authAdmin, orderController.deleteOrder)
router.get('/', authAdmin, orderController.getAllOrders)

module.exports = router