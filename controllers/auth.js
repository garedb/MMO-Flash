let router = require('express').Router()
let db = require('../models')
let passport = require('../config/passportConfig')

router.get('/login', (req, res) => {
	res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
	successFlash: 'Successful Login - Welcome Back!',
	successRedirect: '/profile/user',
	failureFlash: 'Invalid Credentials',
	failureRedirect: '/auth/login'
}))

router.get('/signup', (req, res) => {
	res.render('auth/signup', { data: {} })
})

router.post('/signup', (req, res, next) => {
	if (req.body.password !== req.body.password_verify) {
		req.flash('error', 'Passwords do not match!')
		res.render('auth/signup', { data: req.body, alerts: req.flash() })
	}
	else {
		db.user.findOrCreate({
			where: { email: req.body.email },
			defaults: req.body
		})
		.then(([user, wasCreated]) => {
			if(wasCreated) {
				passport.authenticate('local', {
					successFlash: 'Successful Login - Welcome!',
					successRedirect: '/profile/user',
					failureFlash: 'Invalid Credentials',
					failureRedirect: '/auth/login'
				})(req, res, next)
			}
			else {
				req.flash('error', 'Account already exists!')
				res.redirect('/auth/login')
			}
		})
		.catch(err => {
			console.log('Error creating a user', err)
			if(err.errors) {
				err.errors.forEach(e => {
					if (e.type == 'Validation error') {
						req.flash('error', e.message)
					}
				})
				res.render('auth/signup', { data: req.body, alerts: req.flash() })
			}
			else {
				req.flash('error', 'Server Error')
			}
			res.redirect('/auth/signup')
		})
	}	
})	
	
router.get('/logout', (req, res) => {
	req.logout()
	req.flash('success', 'See you next time!')
	res.redirect('/')
})

module.exports = router