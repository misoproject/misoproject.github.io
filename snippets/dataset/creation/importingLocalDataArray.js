var myData = [
  { state : "Alabama", population : 4802740 },
  { state : "Massachusetts", population : 6587536 }
];

var ds = new Miso.Dataset({
  data : myData
});

ds.fetch({ 
  success : function() {
    log("Column Names: ", ds.columnNames());
  }
});