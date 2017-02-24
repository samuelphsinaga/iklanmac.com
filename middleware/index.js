var lapakmacs     = require('../models/lapakmacs');
var Comment       = require('../models/comment');


// semua middleware ada disini
var middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
          // req.flash('error', 'Komentar gak ada nih')
          res.redirect('back')
        } else {
          if(foundComment.author.id.equals(req.user._id)){
            next();
          } else {
            req.flash('error', 'You dont have premission to do that')
            res.redirect('back')
          }
        }
      });
    } else {
      req.flash('error', 'Kamu harus login terlebih dahulu')
      res.redirect('back');
    }
};

middlewareObj.checkLapakOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    lapakmacs.findById(req.params.id, function(err, foundMac){
      if(err){
        req.flash('error', 'Lapak gak ada nih')
        res.redirect('back')
      } else {
        if(foundMac.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', 'You dont have premission to do that')
          res.redirect('back')
        }
      }
    });
  } else {
    req.flash('error', 'Kamu harus login terlebih dahulu')
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', 'Kamu harus login terlebih dahulu');
  res.redirect('/login');
};


module.exports = middlewareObj;
