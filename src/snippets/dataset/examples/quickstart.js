var ds = new Miso.Dataset({
  url : "/data/crudeoil.csv",
  delimiter : ",",
  columns : [
    { name : "Year", type : "time", format : "YYYY" }
  ]
});
log('a');
