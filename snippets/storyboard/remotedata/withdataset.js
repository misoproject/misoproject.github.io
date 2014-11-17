var story = new Miso.Storyboard({

  // placeholder for data. It doesn't have to live under the
  // storyboard... it can be a part of your namespace and so on.
  data : null,

  initial : 'loading',
  scenes : {

    // data loading scene
    loading : {
      enter : function() {
        var done = this.async();
        log("Fetching data...");
        
        // create a new dataset
        this.parent.data = new Miso.Dataset({
          url : "/data/crudeoil.csv",
          delimiter : ",",
          columns : [
            { name : "Year", type : "time", format : "YYYY" }
          ]
        });

        // We are going to fetch the data remotely
        // when the fetching is done, just notify our storyboard
        // that this is done.
        this.parent.data.fetch().then(done);
      },

      // by the time we are able to exit, our data has been loaded. 
      // this is a good place to compute some things.
      exit : function() {
        
        // random calculation, for example:
        var averageCrudeOilProduction = this.parent
          .data
          .mean("Crude oil production (1000 barrels per day)");

        log(averageCrudeOilProduction);
      }
    },
    done : {}
  }
});

story.start().then(function() {
  story.to('done');
});