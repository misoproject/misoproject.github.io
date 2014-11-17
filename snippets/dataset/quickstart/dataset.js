var ds = new Miso.Dataset({
  data : data
});

ds.fetch({ 
  success : function() {
    log("Dataset Ready. Columns: " + this.columnNames());
    log("There are " + this.length + " rows");
    log("Available Colors: " + this.column("color").data);
  }
});