var ds = new Miso.Dataset({
  data : [
    { one : 12,  two : 40,  three : 40 },
    { one : 1,   two : 40,  three : 40 },
    { one : 102, two : 430, three : 20 }
  ]
});
ds.fetch({
  success : function() {
    // do things here after data successfully fetched.
    // note 'this' references the dataset.
    log(this.columnNames());
  },
  
  error : function() {
    // do things here in case your data fetch fails.
  }
});