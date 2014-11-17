// initialize a new dataset
var ds = new Miso.Dataset({
  data: { 
    columns : [ 
      { name : "one",   data : [10, 2, 3, 14, 3, 4] },
      { name : "two",   data : [40,  5, 6, 1,  1, 1] },
      { name : "three", data : [400,  5, 6, 1,  -1, 1] }
    ] 
  },
  strict: true
});

_.when(ds.fetch()).then(function() {  
  log("sum of one", ds.sum("one"));
  log("sum of two", ds.sum("two"));
  log("sum of one & two", ds.sum(["one", "two"]));
  log("sum of all", ds.sum());
});