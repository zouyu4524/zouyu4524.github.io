(function () {
  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js(SOURCES.jquery, function() {
    $("#back-top").hide();
    $(document).ready(function () {
      $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
          $('#back-top').fadeIn();
        } else {
          $('#back-top').fadeOut();
        }
      });
      $('#back-top a').click(function () {
        $('body,html').animate({
          scrollTop: 0
        }, 800);
          return false;
      });
    });
  });
})();