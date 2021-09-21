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
