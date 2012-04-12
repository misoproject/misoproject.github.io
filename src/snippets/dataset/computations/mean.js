// initialize a new dataset
var ds = new Miso.Dataset({
  data: { 
    columns : [ 
      { name : "one",   data : [10, 2, 3] },
      { name : "date",  data : ["2011 01 01", "2012 03 05", "2001 02 01"]}
    ] 
  },

  columns : [
    { name : "date", type : "time", format : "YYYY MM DD" }
  ],
  strict: true
});

_.when(ds.fetch()).then(function() {  
  log("mean of one",  ds.mean("one"));
  log("mean of date", ds.mean("date").format("DD/MM/YYYY"));
});