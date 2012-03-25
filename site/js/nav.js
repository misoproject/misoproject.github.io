//This manages all the naviagation bar functionality
$(function() {

  //some basic shortcuts
  var $window = $(window),
      $nav = $('nav'),
      $article = $('article'),
      currently_fixed, //used as a quick check to avoid overhead
      footer_top = $('footer').offset().top;

  //Used to adjust the left hand position of the navigation on 
  //window resize
  var navAdjust = function() {
    left = $article.offset().left;
    if (currently_fixed) {
      $nav.css({ left: left });
    }
  }

  //This sets up bindings etc for the navigation when
  //the window is wide enough
  var setupNav = function () {
    //given this is being called on scroll I'm caching
    //everything I can.
    var fixed = ($nav.css('position') === 'fixed'),
        top = 408,
        left = $nav.offset().left,
        height = $window.height(),
        nav_height= $nav.height();
        //This is all of the subsections of the current page
        anchors = _.map($('nav ul ul li a'), function(a) { 
          var $a = $(a);
          var id = $a.attr('href');
          return [ id, $(id).offset().top, $a, false ];
        });

    $window.scroll(function () {
      var scroll = $window.scrollTop(),
      bottom = scroll + height,
      done = false;

      //highlight the current section of the page you've scrolled to
      _.each(anchors, function(a) {
        if (a[3] === true) {
          a[2].removeClass('active');
          a[3] = false;
        }
        if (!done && (a[1] >= scroll) ) {
          done = true;
          a[2].addClass('active');
          a[3] = true;
        }
      });

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

    //Cute little animation on the anchor links
    $('ul ul a').click(function() {
      $('html,body').animate({ scrollTop: $( $(this).attr('href') ).offset().top }, 'slow');
    });


    //reposition fixed nav on resize
    $window.resize(navAdjust);
  }


  if ( $('nav').length !== 0 ) {
    $window.bind('resize onorientationchange', function() {
      if ( $window.width() < 840 ) { 
        $window.unbind('scroll');
        //unbind navAdjust but not this function!
        $window.unbind('resize', navAdjust);
        $nav.attr('style', '');
      } else {
        setupNav();
      }
    });
    $window.trigger('resize');
  }

});

