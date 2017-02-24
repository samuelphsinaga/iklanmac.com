var express       = require('express');
var router        = express.Router();
var lapakmacs     = require('../models/lapakmacs');
var middleware    = require('../middleware');

//index - show all lapak
router.get('/', function(req, res) {
  // cek semua db
  lapakmacs.find({}, function(err, allLapakMac) {
    if(err) {
      console.log(err);
    } else {
      res.render("lapakmac/index", {lapakmac:allLapakMac, currentUser: req.user});
    }
  })

});

router.get('/', function(req, res){
  lapakmacs.findAll(req.params.name, function(err, searchMac){
    res.render("/lapakmac", {search : searchMac})
  })
})

// create lapak
router.post('/', middleware.isLoggedIn, function(req, res){
  // res.send("your hit the post route!");
  // ambil data dari form dan coba masukkan ke db
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newLapakMac = {name: name, price: price, image: image, description: desc, author: author};
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
router.get('/new', middleware.isLoggedIn, function(req, res){
  res.render("lapakmac/new");
});

// keterangan lengkap tiap item
router.get('/:id', function(req, res){
  lapakmacs.findById(req.params.id).populate("comments").exec(function(err, foundMac){
    if(err){
      console.log(err);
    } else {
      console.log(foundMac);
        res.render("lapakmac/show", {lapakmacs: foundMac});
    }
  });
});

//edit lapakmac
router.get('/:id/edit', middleware.checkLapakOwnership, function(req, res){
  // cek apakah user sudah log in?
  lapakmacs.findById(req.params.id, function(err, foundMac){
    res.render("lapakmac/edit", {lapakmacs: foundMac});
  });
});

//update lapakmac
router.put('/:id', middleware.checkLapakOwnership, function(req, res){
  // mencari dan update lapak yg sesuai
  lapakmacs.findByIdAndUpdate(req.params.id, req.body.lapakmacs, function(err, updatedLapakmacs){
    if(err){
      res.redirect('/lapakmac');
    } else {
      res.redirect('/lapakmac/' + req.params.id);
    }
  });
});

// destroy lapakmac
router.delete('/:id', middleware.checkLapakOwnership, function(req, res){
  lapakmacs.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect('/lapakmac');
    } else {
      res.redirect('/lapakmac');
    }
  });
});


module.exports = router;
