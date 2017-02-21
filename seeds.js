var mongoose   = require('mongoose');
var lapakmacs  = require('./models/lapakmacs');
var Comment    = require('./models/comment');

var data = [
  {
    name: "Supinem",
    image: "http://images.techhive.com/images/article/2015/04/new-macbook-primary-100578162-large.jpg",
    description: "New Macbook Pro, barang masih mulus dan batre awet seminggu gan!"
  },
  {
    name: "Sutarjo",
    image: "http://d.christianpost.com/full/76738/640-426/img.jpg",
    description: "Barang masih terawat dengan baik gan."
  },
  {
    name: "Sukijan",
    image: "https://cnet3.cbsistatic.com/img/0TSVDM9VkyPnjP88zQlQMUkS9dc=/770x433/2013/10/22/55d5c133-67c2-11e3-a665-14feb5ca9861/Apple_Macbook_Pro_15_35781448-4070.jpg",
    description: "Bosan pakai macbook gan, pengen pakai kalkulator aja."
  }
];

function seedDB(){
  // hapus semua lapak
  lapakmacs.remove({}, function(err){
    if(err){
      console.log(err);
    }
      console.log("remove lapak!");
      data.forEach(function(seed){
        lapakmacs.create(seed, function(err, lapakmac){
          if(err){
            console.log(err);
          } else {
            console.log("Added a new lapak!");
            Comment.create(
              {
                text: "sundul gan!",
                author: "kumar"
              }, function(err, comment){
                if(err){
                  console.log(err);
                } else {
                  lapakmac.comments.push(comment);
                  lapakmac.save();
                  console.log("Created new comment");
                }
              });
          }
      });
    });
  });
    // data.forEach(function(seed){
    //   lapakmacs.create(seed, function(err, Lapakmacs){
    //     if(err){
    //       console.log(err);
    //     } else {
    //       console.log("added a new lapak");
    //       // untuk komentar
    //       Comment.create(
    //         {
    //           text: "harganya kurangin dikit gan",
    //         author: "kumar"
    //         }, function (err, comment){
    //           if(err){
    //           console.log(err);
    //         } else {
    //           Lapakmacs.Comment.push(comment);
    //           Lapakmacs.save();
    //           console.log("Created new comment");
    //         }
    //       });
    //     }
    //   });
    // });
};

module.exports = seedDB;
