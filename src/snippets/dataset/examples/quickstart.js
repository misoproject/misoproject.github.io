//Load Uranium Production Data
var ds = new Miso.Dataset({
  url : "/data/uranium.csv",
  delimiter : ",",
  columns : [
    { name : "Year", type : "time", format : "YYYY" }
  ]
});

//Select the rows in the '80s
ds.each(function(row) {
  log(JSON.stringify(row));
});

//Find their average
