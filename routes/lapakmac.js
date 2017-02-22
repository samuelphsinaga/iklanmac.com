var express       = require('express');
var router        = express.Router();
var lapakmacs     = require('../models/lapakmacs');

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

// create lapak
router.post('/', function(req, res){
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
router.get('/new', function(req, res){
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


module.exports = router;
