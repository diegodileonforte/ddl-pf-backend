const router = require('express').Router()
const categoryController = require('../controllers/categoryController')
const auth = require('../auth/auth')
const authAdmin = require('../auth/authAdmin')


router.route('/category')
    .get(categoryController.getCategories)
    .post(auth, authAdmin, categoryController.createCategory)


router.route('/category/:id')
    .delete(auth, authAdmin, categoryController.deleteCategory)
    .put(auth, authAdmin, categoryController.updateCategory)


module.exports = router
