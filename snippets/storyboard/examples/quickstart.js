var demoBlock = $('#demoblock'),
    boxCache;
var boxes = new Miso.Storyboard({
  initial : 'loading',
  scenes : {
    loading : {

      enter : function() {
        // set up some loading text...
        boxCache = [];
        demoBlock.html("Click Run to paint more boxes...");
      },

      exit : function() {
        // we are almost done loading,
        // set up the stage
        // with the elements we need.
        demoBlock.empty();
        for(var i = 0; i < 9; i++) {
          var box = makeOrangeBox();
          box.appendTo(demoBlock);
          boxCache.push(box);
        }
      }

    },

    painting : {
      enter : function() {

        // we are going to use some jQuery transitions,
        // so this will be an async function
        var transitionDone = this.async();

        // fade the boxes in
        for (var i = 0; i < boxCache.length; i++) {
          boxCache[i].delay(i * 200).fadeIn('slow');
          // on the last box, notify that we are done with
          // this transition by calling transitionDone!
          if (i === boxCache.length-1) {
            boxCache[i].promise().done(transitionDone);
          }
        }
      },

      exit : function() {

        // The painting out is also asynchronous!
        var transitionDone = this.async();

        // Fade the boxes out
        for (var i = boxCache.length - 1; i >= 0; i--) {
          // reverse the delay on the fade out.
          boxCache[i]
            .delay((boxCache.length - i + 1) * 400)
            .fadeOut('slow');
          // When we fade out the first box, we are done.
          if (i === 0) {
            boxCache[i].promise().done(transitionDone);
          }

        }
      }
    },

    ending : {}
  }
});

boxes.start().then(function() {
  boxes.to('painting').then(function() {
    boxes.to('loading');
  });
});
