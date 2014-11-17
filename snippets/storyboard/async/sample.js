var story = new Miso.Storyboard({
  initial : 'loading',
  scenes : {
    // do nothing here... just kicking things off.
    loading : {},
    a : {
      enter : function() {
        // declare this function is asyncronous!
        // Calling this.async returns a _function_
        // you should then call when you're done with all
        // your work.
        var done = this.async();
        
        log("Going to start some time consuming work...");
        
        // do your async work here.... for example
        // in a setTimeout!
        setTimeout(function() {
          // do something.....
          log("Done with my time consuming work...!");
        
          // then call the done function when you're done!
          done();
        }, 1500);
      }
    },
    b : {
      enter : function() {
        log("And now we've transitioned to scene b...");
      }
    }
  }
});

story.start().then(function() {
  story.to('a').then(function() {
    story.to('b');
  });
});