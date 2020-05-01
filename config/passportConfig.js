require('dotenv').config()

let passport = require('passport')

let LocalStrategy = require('passport-local').Strategy

let db = require('../models')

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser((id,  done) => {
	db.user.findByPk(id)
	.then(user => {
		done(null, user)
	})
	.catch(done)
})

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, (email, password, done) => {
	db.user.findOne({
		where: { email: email }
	})
	.then(foundUser => {
		if (foundUser && foundUser.validPassword(password)) {
			done(null, foundUser)
		}
		else {
			done(null, null)

		}
	})
	.catch(done)
}))

module.exports = passport