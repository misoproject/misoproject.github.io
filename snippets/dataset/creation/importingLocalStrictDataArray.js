var myData = {
  columns : [
    { name : "state", data : ["Alabama", "Massachusetts"] },
    { name : "population", data : [4802740, 6587536] }
  ]
};

var ds = new Miso.Dataset({
  data : myData,
  strict : true
});

ds.fetch({ 
  success : function() {
    log("Column Names: ", ds.columnNames());
  }
});