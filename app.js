var app           = require('express')();
var express       = require('express');
var http          = require('http').Server(app);
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var passport      = require('passport');
var localStrategy = require('passport-local');
var lapakmacs     = require('./models/lapakmacs');
var Comment       = require('./models/comment');
var User          = require('./models/user');
var seedDB        = require('./seeds');

//requiring routes
var commentRoutes = require('./routes/comments');
var lapakmacRoutes = require('./routes/lapakmac');
var indexRoutes   = require('./routes/index');

mongoose.connect('mongodb://localhost/iklanmac8');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
console.log(__dirname);
// seedDB(); // seed database

// PASPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'Once again to get your lapak goals!',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// current user declare here
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRoutes);
app.use('/lapakmac', lapakmacRoutes);
app.use('/lapakmac/:id/comments', commentRoutes);

http.listen(3000, function(){
  console.log("Iklan Mac Server Has Started!!");
});
