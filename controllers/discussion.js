let router = require('express').Router()
let db = require('../models')

router.get('/', (req, res) => {
	db.discussion.findAll()
	.then(discussions => {
	res.render('discussion/index', { discussions: discussions})	
	})
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
		res.redirect(`/discussion/${post.id}`)
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

router.put('/:id',(req,res)=>{

  db.discussion.update({
    content: req.body.content
  }, {
    where: {
      id: req.body.id
    }
  }).then(function(discussion) {
    // do something when done updating
    res.redirect('/discussion/'+req.body.id)
  })
})

router.get('/:id/edit',(req,res)=>{
  db.discussion.findOne({
    where: { id: req.params.id }
  })
  .then(function(discussion) {
    if (!discussion) throw Error()
       res.render('discussion/edit', { discussion: discussion })
    
  })
})

router.delete('/:id', (req, res) => {
    db.discussion.destroy({
        where: { id: req.params.id}
    })
    .then(() => {
        res.redirect('/')
    })
    .catch(err => {
        console.log('Error in delete route', err)
        res.render('error')
    })
})
module.exports = router