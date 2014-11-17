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
  comparator : function(r1, r2) {
    if (r1.one > r2.one) {return 1;}
    if (r1.one < r2.one) {return -1;}
    return 0;
  }
});

_.when(ds.fetch()).then(function(){
  ds.eachColumn(function(columnName) {
    log(ds.column(columnName).data);
  });
});