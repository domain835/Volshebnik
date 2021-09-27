// @@include('alert.js');

function testWebP(callback) {

  var webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
  
testWebP(function (support) {
  if (support == true) {
    document.querySelector('body').classList.add('webp');
  }else{
    document.querySelector('body').classList.add('no-webp');
  }
});

$(function () {

  $('.top-slider').slick({
    dots: true,
    autoplay: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    variableWidth: true,
    adaptiveHeight: true
  });

  $('.contacts__slider').slick({
    dots: true,
    adaptiveHeight: true
  });

  $('.menu__icon').on('click', function() {
    $('.menu').toggleClass('menu--active');
  });

  $('[data-fancybox]').fancybox({
    youtube : {
        controls : 0,
        showinfo : 0
    }
  });

});
