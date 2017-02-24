var express       = require('express');
var router        = express.Router();
var passport      = require('passport');
var User          = require('../models/user');

// root route
router.get('/', function(req, res){
  res.render("landing");
});

// ==============
// AUTH ROUTES
// ==============

// Show register form
router.get('/register', function(req, res){
  res.render('register');
});


// handle Sign Up logic
router.post('/register', function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      return res.render("register", {"error": err.message});
    }
    passport.authenticate('local')(req, res, function(){
      req.flash('success', 'Welcome to iklanmac ' + user.username);
      res.redirect('/lapakmac');
    })
  })
})

// show login form
router.get('/login', function(req, res){
  res.render('login');
});

//handling logic post
router.post('/login', passport.authenticate('local',
    {
      successRedirect : '/lapakmac',
      failureRedirect : '/login'
    }), function(req, res){
  res.render()
})


// log out route
router.get('/logout', function(req, res){
  req.logout();
  req.flash('error', 'Logged you out!');
  res.redirect('/lapakmac');
});

module.exports = router;
