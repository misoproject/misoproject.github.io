var ds = new Miso.Dataset({
  url : 'http://misoproject.com/data/crudeoil.csv',
  delimiter : ','
});

ds.fetch({
  success : function() {
    log("Available Columns:" + this.columnNames());
    log("There are " + this.length + " rows");
  }
});