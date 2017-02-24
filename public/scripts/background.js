var counter = 0;

function changeBG() {
  var imgs = [
        'url(../imgs/1.jpg)'
      ];

  if (counter === imgs.length) {
    counter = 0;
  }
  document.body.style.backgroundImage = imgs[counter];

  counter++;
}

setInterval(changeBG, 7500);
