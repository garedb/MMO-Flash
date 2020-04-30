/*****************************
* NODE MODULES
/*****************************/

// Add in environment
require('dotenv').config()

// Require needed modules
let express = require('express')
let flash = require('connect-flash')
let layouts = require('express-ejs-layouts')
let session = require('express-session')
let moment = require('moment')
let methodOverride = require('method-override')

// Create an app instance
let app = express()

// Include passport (via the passport config file)
let passport = require('./config/passportConfig')

/*****************************
* SETTING / MIDDLEWARE
/*****************************/

// Set template lang to EJS
app.set('view engine', 'ejs')

// Tell express to use the layouts module
app.use(layouts)

// Set up the static folder
app.use(express.static('static'))

// Decrypt the variables coming in via post routes (from forms)
app.use(express.urlencoded({ extended: false }))

// set up sessions
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}))

// Set up connect-flash for the flash alert messages (depends on session, order matters)
app.use(flash())

// Set up passport (depends on session; must come after it)
app.use(passport.initialize())
app.use(passport.session())

// Custom middleware - make certain variables available to EJS pages through locals
app.use((req, res, next) => {
	res.locals.alerts = req.flash()
	res.locals.user = req.user
	res.locals.moment = moment
	next()
})

app.use(require('morgan')('dev'))
app.use(methodOverride('_method'))
//*****************************
//* ROUTES
//*****************************/

// Controllers
app.use('/auth', require('./controllers/auth'))
app.use('/profile', require('./controllers/profile'))
app.use('/games', require('./controllers/games'))
app.use('/discussion', require('./controllers/discussion'))

// Creat a home page route above wildcard route
app.get('/', (req, res) => {
	res.render('home')
})

// Create a wildcard (catch-all) route
app.get('*', (req, res) => {
	res.render('error')

})

/*****************************
* LISTEN
/*****************************/

// Pick a port to listen on
app.listen(process.env.PORT || 3000)