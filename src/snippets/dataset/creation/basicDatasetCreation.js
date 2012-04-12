var ds = new Miso.Dataset({
  data : [
    { one : 12,  two : 40,  three : 40 },
    { one : 1,   two : 40,  three : 40 },
    { one : 102, two : 430, three : 20 }
  ]
});
ds.fetch({ 
  success : function() {
    log("Columns: ", this.columnNames());
    log("Row Count ", this.length);
  }
});