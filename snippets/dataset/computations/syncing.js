// initialize a new dataset
var ds = new Miso.Dataset({
  data: { 
    columns : [ 
      { name : "one", data : [10, 2, 3] },
      { name : "two", data : [1, 20, 3] }
    ] 
  },
  sync : true,
  strict: true
});

_.when(ds.fetch()).then(function() {  

  var max = ds.max();
  log("Max of all",  max.val());
  max.bind("change", function(event) {
    log("New Value", max.val());
  });

  ds.add({
    one : 100, two : 100
  });
});