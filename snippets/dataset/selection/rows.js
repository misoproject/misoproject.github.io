// initialize a new dataset
var ds = new Miso.Dataset({
  data: { 
    columns : [ 
      { name : "one",   data : [10, 2, 3, 14, 3, 4] },
      { name : "two",   data : [4,  5, 6, 1,  1, 1] },
      { name : "three", data : [7,  8, 9, 1,  1, 1] } 
    ] 
  },
  strict: true
});

_.when(ds.fetch()).then(function(){
  // create a subset of rows where the values in
  // column one are divisible by 2.
  var subset = ds.rows(function(row) {
    return (row.one % 2 === 0);
  });
  
  log("Subset length", subset.length);
  log(subset.column("one").data);
  log(subset.column("two").data);
  log(subset.column("three").data);
});