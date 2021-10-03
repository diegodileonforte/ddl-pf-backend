const router = require('express').Router()
const cartController= require('../controllers/cartController')
const auth = require('../auth/auth')


router.post('/', auth, cartController.newCart)
router.get('/:id', auth, cartController.getCartByUserId)
router.put('/:id', auth, cartController.updateCart)
router.delete('/:id', auth, cartController.deleteCart)

module.exports = router