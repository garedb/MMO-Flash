require('dotenv').config()

let express = require('express')
let flash = require('connect-flash')
let layouts = require('express-ejs-layouts')
let session = require('express-session')
let moment = require('moment')
let methodOverride = require('method-override')
let app = express()
let passport = require('./config/passportConfig')

app.set('view engine', 'ejs')

app.use(layouts)
app.use(express.static('static'))
app.use(express.urlencoded({ extended: false }))
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
	res.locals.alerts = req.flash()
	res.locals.user = req.user
	res.locals.moment = moment
	next()
})
app.use(require('morgan')('dev'))
app.use(methodOverride('_method'))
app.use('/auth', require('./controllers/auth'))
app.use('/profile', require('./controllers/profile'))
app.use('/games', require('./controllers/games'))
app.use('/discussion', require('./controllers/discussion'))

app.get('/', (req, res) => {
	res.render('home')
})

app.get('*', (req, res) => {
	res.render('error')

})

app.listen(process.env.PORT || 3000)