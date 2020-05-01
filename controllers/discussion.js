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
		userId: req.user.id
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
      id: req.params.id,
      userId: req.user.id
    }
  }).then(function(discussion) {
    res.redirect('/discussion/'+req.params.id)
  })

})

router.get('/:id/edit',(req,res)=>{
    db.discussion.findOne({
      where: { id: req.params.id }
    })
    .then(function(discussion) {
      if (!discussion) throw Error()
       console.log(req.user.id, discussion.userId)
      if (req.user.id == discussion.userId) {
       res.render('discussion/edit', { discussion: discussion })
      } else {
        res.redirect('/discussion')
      }
    
    })

})

router.delete('/:id', (req, res) => {
  console.log(req.user.id, req.body)
  if (req.user.id.toString() == req.body.userId) {
    db.discussion.destroy({
        where: { id: req.params.id}
    })
    .then(() => {
        res.redirect('/discussion')
    })
    .catch(err => {
        console.log('Error in delete route', err)
        res.render('error')
    })
  } else {
    res.redirect('/discussion')
  }
})
module.exports = router