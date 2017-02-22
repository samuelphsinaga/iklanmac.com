var express       = require('express');
var router        = express.Router({mergeParams: true});
var lapakmacs     = require('../models/lapakmacs');
var Comment       = require('../models/comment');

// ====================
// COMMENTS ROUTES
// ====================

// comments new
router.get('/new',isLoggedIn, function(req, res){
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
router.post('/',isLoggedIn, function(req, res){
  // melihat laoakmac by id
  lapakmacs.findById(req.params.id, function(err, lapakmac){
    if(err){
      console.log(err);
      res.redirect('/lapakmac');
    } else {
        Comment.create(req.body.comment, function(err, comment){
          if(err){
            console.log(err);
          } else {
            lapakmac.comments.push(comment);
            lapakmac.save();
            res.redirect('/lapakmac/' + lapakmac._id)
          }
        })
    }
  })
});

// fungsi authenticate comment login atau middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
};

module.exports = router;
