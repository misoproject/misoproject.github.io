//handles the scrolling moving between fixed and absolute
$(function() {

  var $window = $(window),
      $nav = $('nav'),
      $article = $('article'),
      currently_fixed; //used as a quick check to avoid overhead

  var navAdjust = function() {
    left = $article.offset().left;
    if (currently_fixed) {
      $nav.css({ left: left });
    }
  }

  var setup = function () {
    //given this is being called on scroll I'm caching
    //everything I can.
    var fixed = ($nav.css('position') === 'fixed'),
    top = 408,
    left = $nav.offset().left,
    height = $window.height(),
    anchors = _.map($('nav ul ul li a'), function(a) { 
      var $a = $(a);
      var id = $a.attr('href');
      return [ id, $(id).offset().top, $a ];
    }).reverse()

    $window.scroll(function () {
      var scroll = $window.scrollTop(),
      bottom = scroll + height,
      done = false;

      //highlight for the nav
      _.each(anchors, function(a) {
        a[2].removeClass('active');
        if (!done && (a[1] < scroll + height) ) {
          done = true;
          a[2].addClass('active');
        }
      });

      //move the nav as user scrolls
      if (scroll > top) {
        if (currently_fixed) { return }
        $nav.css({
          left: left,
          top: 20,
          position: 'fixed'
        });
        currently_fixed = true;
      } else if (currently_fixed) {
        $nav.css({
          position: 'absolute',
          top: top,
          left: 0
        });
        currently_fixed = false;
      }

    });

    //reposition fixed nav on resize
    $window.resize(navAdjust);
  }

  $window.bind('resize onorientationchange', function() {
    console.log('sz');
    if ( $window.width() < 840 ) { 
      $window.unbind('scroll');
      $window.unbind('resize', navAdjust);
      $nav.attr('style', '');
    } else {
      console.log('setup!');
      setup();
    }
  });
  $window.trigger('resize');

});

