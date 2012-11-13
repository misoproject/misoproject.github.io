var story = new Miso.Storyboard({
  initial : 'loading',

  scenes : {
    loading : {
      enter : function() {
        log("Executing loading's enter");
      },
      exit : function() {
        log("Executing loading's exit");
      }
    },

    done : {}
  }
});

story.subscribe("start", function() {
  log("Callback! transition start");
});
story.subscribe("loading:enter", function() {
  log("Callback! loading:enter");
});
story.subscribe("loading:exit", function() {
  log("Callback! loading:exit");
});
story.subscribe("end", function() {
  log("Callback! transition end");
});

story.start().then(function() {
  story.to('done');
});