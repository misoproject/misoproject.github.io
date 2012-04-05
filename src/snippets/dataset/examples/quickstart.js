//Load Uranium CSV File. Looks like:
// year,value
// 1980,43.7
// 1981,38.47
// ...
// 2005,2.69
var ds = new Miso.Dataset({
  url : "/data/uranium.csv",
  delimiter : ",",
  columns : [
    { name : "year", type : "time", format : "YYYY" }
  ]
});

ds.fetch({
  success: function() {
    //Select the rows in the '80s
    var uraniumInThe80s = this.where({ 
      rows : function(row) {
        return (row.year >= moment("1980") && 
                row.year < moment("1990"));
      }
    });

    // output their average
    log("Average:", uraniumInThe80s.mean("value"));
  }
});
