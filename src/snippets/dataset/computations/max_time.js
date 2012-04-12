// initialize a new dataset
var ds = new Miso.Dataset({
  data: { 
    columns : [ 
      { name : "one",   data : [10, 2, 3] },
      { name : "date",  data : ["2011 01 01", "2012 03 05", "2001 02 01"] }
    ] 
  },

  columns : [
    { name : "date", type : "time", format : "YYYY MM DD" }
  ],
  strict: true
});

_.when(ds.fetch()).then(function() {  
  log("Max of one",  ds.max("one"));
  log("Max of date", ds.max("date").format("DD/MM/YYYY"));
});