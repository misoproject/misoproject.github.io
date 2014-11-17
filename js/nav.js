$(window).load(function() {
  if ($('div.nav_wrapper').length > 0) {
    var $nav = $('div.nav_wrapper'),
    $window = $(window),
    currently_fixed;

    var fixed = ($nav.css('position') === 'fixed'),
        $article = $('article'),
        top = $article.offset().top;
        left = $nav.offset().left - 10, //padding hack
        height = $window.height(),
        nav_height= $nav.height(),
        footer_top = $('footer').offset().top;

    // The navigation should be position statically on pages where the height
    // required by the content is less than the height of the navigation
    // itself.
    if (nav_height > $article.height()) {
      $nav.css('position', 'static');
      return;
    }

    $window.scroll(function () {
      var scroll = $window.scrollTop(),
      bottom = scroll + height,
      done = false;

      //move the nav as user scrolls
      if (scroll > top) {
        if (currently_fixed) { 

          //if we hit the footer, abs. position till we go back up
          //magic is a magic number for the padding on the article
          //the +20 is for the padding on the nav so there's no jump
          var magic = 230;
          if ( (scroll + nav_height) > (footer_top - magic) ) {
            $nav.css({
              position: 'absolute',
              top: footer_top - (nav_height + magic + 20),
              left: 0
            });
            current_fixed = false;
            return;
          }
        }
        $nav.css({
          left: left,
          top: 0,
          position: 'fixed'
        });
        $nav.height($window.height());
        currently_fixed = true;

      } else if (currently_fixed) {
        $nav.css({
          position: 'absolute',
          top: 0,
          left: 0
        });
        $nav.height($window.height() - $nav.offset().top);

        currently_fixed = false;
      }

    });

    $window.trigger('scroll');
  }
});
