var makingDough = new Miso.Storyboard({
  scenes : {
    // get flour
    enter : {
      enter : function() {
        log("Getting flour");
      },
      exit : function() {
        log("Got flour");
      }
    },
    // make flour
    exit : {
      enter : function() {
        log("Sifting flour");
      },
      exit : function() {
        log("Done sifting");
      }
    }
  }
});

var makingCookies = new Miso.Storyboard({
  initial : 'enter',
  scenes : {
    // make cookies 
    enter : {
      enter : function() {
        log("Forming cookie shapes")
      },
      exit : function() {
        log("Put cookies on baking sheet");
      }
    },

    // bake
    exit : {
      enter: function() {
        var done = this.async();
        log("Putting cookies in the oven");
        setTimeout(function() {
          log("Done baking!");
          done();
        }, 1000);
      },
      exit : function() {
        log("Getting cookies out of the oven");
      }
    }
  }
});

var recipe = new Miso.Storyboard({

  initial : 'makingDough',

  scenes : {
    makingDough : makingDough,
    makeCookies : makingCookies,
    eat : {
      enter : function() {
        log("COOKIES!");
      }
    }
  }
});

recipe.start().then(function() {
  recipe.to('makeCookies').then(function() {
    recipe.to('eat');  
  });
});