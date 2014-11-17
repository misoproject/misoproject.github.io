var ds1 = new Miso.Dataset({
  data : [
    { one : 12,  two : 40,  three : 40 },
    { one : 1,   two : 40,  three : 40 },
    { one : 102, two : 430, three : 20 }
  ]
});
var ds2 = new Miso.Dataset({
  data : [
    { col1 : 1,  col2 : 400,  col3 : 420 },
    { col1 : 4,  col2 : 50,   col3 : 4220 },
    { col1 : 22, col2 : 0,    col3 : 24430 }
  ]
});
    
_.when(ds1.fetch(), ds2.fetch()).then(function() {
  // do things when both datasets are fetched.
  // note 'this' is NOT set to the dataset here.
  log(ds1.columnNames(), ds2.columnNames());
});