var express       = require('express');
var router        = express.Router({mergeParams: true});
var lapakmacs     = require('../models/lapakmacs');
var Comment       = require('../models/comment');
var middleware    = require('../middleware');

// ====================
// COMMENTS ROUTES
// ====================

// comments new
router.get('/new', middleware.isLoggedIn, function(req, res){
  // find campground by id
  lapakmacs.findById(req.params.id, function(err, lapakmac){
      if(err){
        console.log(err);
      } else {
        res.render("comments/new", {lapakmac: lapakmac});
      }
  })
});


// comments create
router.post('/', middleware.isLoggedIn, function(req, res){
  // melihat laoakmac by id
  lapakmacs.findById(req.params.id, function(err, lapakmac){
    if(err){
      console.log(err);
      res.redirect('/lapakmac');
    } else {
        Comment.create(req.body.comment, function(err, comment){
          if(err){
            req.flash('error', 'Ada yang salah nih')
            console.log(err);
          } else {
            // menambah username dan id ke comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            // simpan comment
            comment.save();
            lapakmac.comments.push(comment);
            lapakmac.save();
            req.flash('succes', 'Komen agan berhasil ditambahkan')
            res.redirect('/lapakmac/' + lapakmac._id)
          }
        })
    }
  })
});


// route buat edit komen
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect('Back');
    } else {
        res.render('comments/edit', {lapakmac_id: req.params.id, comment: foundComment});
    }
  });
});

// comment update
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect('back');
    } else {
      res.redirect('/lapakmac/' + req.params.id);
    }
  });
});

// hapus comment
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect('back');
    } else {
      req.flash('success', 'Komentar agan berhasil dihapus')
      res.redirect('/lapakmac/' + req.params.id);
    }
  });
});

module.exports = router;
