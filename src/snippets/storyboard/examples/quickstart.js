var demoBlock = $('#demoblock'), boxCache;
var boxes = new Miso.Storyboard({
  initial : 'loading',
  scenes : {
    loading : {

      enter : function() {
        // set up some loading text...
        boxCache = [];
        demoBlock.html("Loading...");
      },

      exit : function() {
        // we are almost done loading,
        // set up the stage
        // with the elements we need.
        demoBlock.empty();
        for(var i = 0; i < 9; i++) {
          var box = $('<div>')
            .attr('class', 'demoBox')
            .css({
              display : 'none',
              width : '50px',
              height : '50px',
              float : 'left',
              margin: 4,
              backgroundColor : 'orange',
              position : 'relative'
            });
          box.appendTo(demoBlock)
          boxCache.push(box);
        }
      }

    },

    painting : {
      enter : function() {
        // we are going to use some jQuery 
        // transitions, so this will be
        // an async function
        var done = this.async();
        
        // fade the boxes in
        _.each(boxCache, function(box, i) {
          box.delay( i * 200 ).fadeIn('slow');

          // on the last box, make sure you notify 
          // that we are done with this specific 
          // sequence by calling the done function!
          if (i === boxCache.length-1) {
            boxCache[i].promise().done( done );
          }
        });
      },

      exit : function() {
        var done = this.async();
        _.each(boxCache, function(box, i) {
          var delay = (boxCache.length-i+1)*400
          box.delay( delay ).fadeOut('slow');
          if (i === 0) {
            boxCache[i].promise().done( done );
          }

        });
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
