var app           = require('express')();
var express       = require('express')
var http          = require('http').Server(app);
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var passport      = require('passport');
var localStrategy = require('passport-local');
var lapakmacs     = require('./models/lapakmacs');
var Comment       = require('./models/comment');
var User          = require('./models/user');
var seedDB        = require('./seeds');



mongoose.connect('mongodb://localhost/iklanmac6');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
console.log(__dirname);
seedDB();

// PASPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'Once again Rusty wins cutest dog!',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.get('/', function(req, res){
  res.render("landing");
});

app.get('/lapakmac', function(req, res) {
  // cek semua db
  lapakmacs.find({}, function(err, allLapakMac) {
    if(err) {
      console.log(err);
    } else {
      res.render("lapakmac/index", {lapakmac:allLapakMac});
    }
  })

});

app.post('/lapakmac', function(req, res){
  // res.send("your hit the post route!");
  // ambil data dari form dan coba masukkan ke db
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newLapakMac = {name: name, image: image, description: desc };
  // buat inputan user jual Mac
  lapakmacs.create(newLapakMac, function(err, newlyCreated){
    if(err) {
      console.log(err);
    } else {
      //redirect kembali
      res.redirect('lapakmac/index');
    }
  });

});

// halaman untuk buat lapak baru
app.get('/lapakmac/new', function(req, res){
  res.render("lapakmac/new");
});

// keterangan lengkap tiap item
app.get('/lapakmac/:id', function(req, res){
  lapakmacs.findById(req.params.id).populate("comments").exec(function(err, foundMac){
    if(err){
      console.log(err);
    } else {
      console.log(foundMac);
        res.render("lapakmac/show", {lapakmacs: foundMac});
    }
  });
});

// ====================
// COMMENTS ROUTES
// ====================
app.get('/lapakmac/:id/comments/new', function(req, res){
  // find campground by id
  lapakmacs.findById(req.params.id, function(err, lapakmac){
      if(err){
        console.log(err);
      } else {
        res.render("comments/new", {lapakmac: lapakmac});
      }
  })
});

app.post('/lapakmac/:id/comments', function(req, res){
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
})

// ==============
// AUTH ROUTES
// ==============

// Show register form
app.get('/register', function(req, res){
  res.render('register');
});


// handle Sign Up logic
app.post('/register', function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.render('register');
    }
    passport.authenticate('local')(req, res, function(){
      res.redirect('/lapakmac');
    })
  })
})


http.listen(3000, function(){
  console.log("Iklan Mac Server Has Started!!");
});
