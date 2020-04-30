let router = require('express').Router()
let moment = require('moment')
let adminLogin = require('../middleware/adminLogin')
let userLogin = require('../middleware/userLogin')
let db = require('../models')

router.use(userLogin)

router.get('/user', (req, res) => {
	res.render('profile/user', { moment })
})

module.exports = router