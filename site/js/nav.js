$(window).load(function() {
  //Cute little animation on the anchor links for API
  $('article.api div.nav a').click(function() {
    $('html,body').animate(
      { scrollTop: $( $(this).attr('href') ).offset().top - 20 }, 
      'slow'
    );
  });
});

