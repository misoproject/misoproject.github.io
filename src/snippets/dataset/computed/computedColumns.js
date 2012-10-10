// initialize a new dataset
var ds = new Miso.Dataset({
  data: { 
    columns : [ 
      { name : "state", data : ["MA", "VA"] },
      { name : "v1", data : [10,20] },
      { name : "v2", data : [420,120] }
    ]
  },
  strict: true
});

ds.fetch().then(function() {
  // add a sum column that adds the v1 and v2 rows.
  ds.addComputedColumn("sum", "number", function(row) {
    return row.v1 + row.v2;
  });

  // => [30,540]
  log(ds.column("sum").data);

  ds.add({
    state : "NH", v1 : 50, v2 : 20
  });

  // => [30,540,70]
  log(ds.column("sum").data);  
});