const router = require('express').Router()
const messageController= require('../controllers/messageController')
const auth = require('../auth/auth')
const authAdmin = require('../auth/auth')


router.get('/', authAdmin, messageController.getAllMessages)
router.get('/:email', auth, messageController.getUserMessages)

module.exports = router