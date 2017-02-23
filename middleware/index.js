var lapakmacs     = require('../models/lapakmacs');
var Comment       = require('../models/comment');


// semua middleware ada disini
var middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
          res.redirect('back')
        } else {
          if(foundComment.author.id.equals(req.user._id)){
            next();
          } else {
            res.send('you dont have a premission!')
          }
        }
      });
    } else {
      res.redirect('back');
    }
};

middlewareObj.checkLapakOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    lapakmacs.findById(req.params.id, function(err, foundMac){
      if(err){
        res.redirect('back')
      } else {
        if(foundMac.author.id.equals(req.user._id)){
          next();
        } else {
          res.send('you dont have a premission!')
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
};


module.exports = middlewareObj;
