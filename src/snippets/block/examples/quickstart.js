var Waffle = Miso.Block.extend({
  
  storyboard: new Miso.Storyboard({
    initial : 'loading',
    scenes : {
      loading : {
        enter : function() {
          console.log(this);
        }
      }
    }
  }),

  initialize : function(options) {
    // how big is our chart?
    this.gridSize = options.size || 5;
  },

})

var w = new Waffle();
w.storyboard.start();