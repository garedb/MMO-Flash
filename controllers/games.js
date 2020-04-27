let router = require('express').Router()

router.get('/aau', (req, res) => {
	res.render('games/aau')
})

router.get('/bd', (req, res) => {
	res.render('games/bd')
})

router.get('/ff14', (req, res) => {
	res.render('games/ff14')
})

router.get('/gw2', (req, res) => {
	res.render('games/gw2')
})

router.get('/wow', (req, res) => {
	res.render('games/wow')
})

module.exports = router