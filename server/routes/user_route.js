const router = require('express').Router()
const UserController = require('../controllers/user_controller')

UserController(router)

module.export = router
