let router = require('express').Router()
let db = require('../models')

router.get('/show', (req, res) => {
	res.render('discussion/show')
})

router.get('/new', (req, res) => {
	db.user.findAll()
	.then(users => {
		res.render('discussion/new', { users: users })	
	})
})

router.get('/:id', (req, res) => {
	db.discussion.findOne({
		where: { id: req.params.id },
		include: [db.user, db.comment]
	})
	.then(discussion => {
		if (!discussion) throw Error()
		res.render('discussion/show', { discussion: discussion })
	})
})

router.post('/', (req, res) => {
	db.discussion.create({
		title: req.body.title,
		content: req.body.content,
		userId: req.body.userId
	})
	.then(post => {
		res.redirect('/')
	})
})

router.post('/:id/comments', (req, res) => {
	db.comment.create({
		name: req.body.name,
		content: req.body.content,
		discussionId: req.params.id
	})
	.then(post => {
		res.redirect(`/discussion/${req.params.id}`)
	})
})

module.exports = router