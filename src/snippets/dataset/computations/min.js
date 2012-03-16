// initialize a new dataset
var ds = new Miso.Dataset({
  data: { columns : [ 
    { name : "one",   data : [10, 2, 3, 14, 3, 4] },
    { name : "two",   data : [40,  5, 6, 1,  1, 1] },
    { name : "three", data : [400,  5, 6, 1,  -1, 1] }
  ] },
  strict: true
});

_.when(ds.fetch()).then(function(){  
  console.log("min of one", ds.min("one"));
  console.log("min of two", ds.min("two"));
  console.log("min of one & two", ds.min(["one", "two"]));
  console.log("min of all", ds.min());
});