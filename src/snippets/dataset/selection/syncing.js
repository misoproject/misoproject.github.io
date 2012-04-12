// initialize a new dataset
var ds = new Miso.Dataset({
  data: { 
    columns : [ 
      { name : "one",   data : [10, 2, 3, 14, 3, 4] },
      { name : "two",   data : [4,  5, 6, 1,  1, 1] },
      { name : "three", data : [7,  8, 9, 1,  1, 1] } 
    ] 
  },
  strict: true,
  sync : true
}), subset;

_.when(ds.fetch()).then(function(){
  // create a subset of rows where the values in
  // column one are divisible by 2.
  subset = ds.rows(function(row) {
    return (row.one % 2 === 0);
  });
  
  // bind to the _subset_ add event. 
  subset.bind("add", function(event) {
    log(event);
    log(this.column("one").data);
    log(this.column("two").data);
    log(this.column("three").data);
  });

  // now add a row to the original dataset that still
  // passes the filter. Watch it propagate to the view!
  ds.add({
    one : 100, two : 100, three : 100
  });

  // try to add a row that doesn't pass the filter.
  // This row will NOT be added to the subset and the
  // subset add event won't trigger.
  ds.add({
    one : 101, two : 100, three : 100
  });

});