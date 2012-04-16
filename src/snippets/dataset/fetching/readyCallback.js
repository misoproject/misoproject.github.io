var ds1 = new Miso.Dataset({
  data : [
    { one : 12,  two : 40,  three : 40 },
    { one : 1,   two : 40,  three : 40 },
    { one : 102, two : 430, three : 20 }
  ],
  ready : function() {
    // do something specific to this dataset here when it's
    // been fetched
    log("ds1 columns: " + this.columnNames());
  }
});
var ds2 = new Miso.Dataset({
  data : [
    { col1 : 1,  col2 : 400,  col3 : 420 },
    { col1 : 4,  col2 : 50,   col3 : 4220 },
    { col1 : 22, col2 : 0,    col3 : 24430 }
  ],
  ready : function() {
    // do something specific to this dataset here when it's
    // been fetched
    log("ds2 length: " + this.length);
  }
});
    
_.when(ds1.fetch(), ds2.fetch()).then(function() {
  // do things when both datasets are fetched.
  // note 'this' is NOT set to the dataset here.
  log("Both Datasets Fetched!");
});