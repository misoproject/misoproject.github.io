var ds = new Miso.Dataset({
  data : [
    { one : 12,  two : 40,  three : 40 },
    { one : 1,   two : 40,  three : 40 },
    { one : 102, two : 430, three : 20 }
  ]
});
ds.fetch({ success : function() {
  console.log("Columns: ", this.columnNames());
  console.log("Row Count ", this.length);
}});