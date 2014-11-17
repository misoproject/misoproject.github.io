//Load Uranium Production CSV File, looks like:
// year,value
// 1980,43.7
// ...
var ds = new Miso.Dataset({
  url : "/data/uranium.csv",
  delimiter : ",",
  columns : [
    { name : "year", type : "time", format : "YYYY" }
  ]
});

ds.fetch({
  success: function() {
    //Select rows in the 80's &amp; find their average
    var uraniumInThe80s = this.where({ 
      rows : function(row) {
        return (row.year >= moment([1980]) && 
                row.year < moment([1990]));
      }
    }).mean("value");

    log("80's Average:", uraniumInThe80s);
    log("Total Average:", ds.mean('value') );
  }
});
