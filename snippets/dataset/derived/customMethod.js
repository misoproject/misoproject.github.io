var ds = new Miso.Dataset({
  data : {
    columns : [
      { 
        name : "state",
        type : "string",
        data : ["AZ", "AZ", "AZ", "MA", "MA", "MA"]
      },
      {
        name : "count",
        type : "number",
        data : [1,2,3,4,5,6]
      },
      {
        name : "anothercount",
        type : "number", 
        data : [10,20,30,40,50,60]
      }
    ]
  },
  strict: true
});

_.when(ds.fetch()).then(function() {
  var gb = ds.groupBy("state", ["count", "anothercount"], {
    // multiply all values
    method : function(array) {
      return _.reduce(array, function(memo, num){ 
        return memo * num; 
      }, 1);
    }
  });

  log(gb.column("state").data);
  log(gb.column("count").data);
  log(gb.column("anothercount").data);
});