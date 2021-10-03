const router = require('express').Router()
const productController= require('../controllers/productController')
const auth = require('../auth/auth')
const authAdmin = require('../auth/authAdmin')


router.route('/products')
    .get(productController.getProducts)
    .post(auth, authAdmin, productController.createProduct)


router.route('/products/:id')
    .delete(auth, authAdmin, productController.deleteProduct)
    .put(auth, authAdmin, productController.updateProduct)

module.exports = router