var ds = new Miso.Dataset({
  url : '/data/crudeoil.csv',
  delimiter : ','
});

ds.fetch({
  success : function() {
    log("Available Columns:" + this.columnNames());
    log("There are " + this.length + " rows");
  }
});