var data = [
  { a : 100, b : 1, c : 10 },
  { a : 200, b : 2, c : 20 },
  { a : 300, b : 3, c : 30 }
];

var ds = new Miso.Dataset({
  data : data,
  sync : true
});

ds.fetch({
  success : function() {
    var subselection = ds.where({
      rows : function(row) {
        return row.a > 150;
      }
    });

    log("Subselection length: ", subselection.length);
    log("Subselection content: ", subselection.toJSON());

    // now change some value in the original data
    ds.add({
      a : 500, b : 500, c : 500
    });

    // there should now be +1 rows in subselection
    log("Subselection length: ", subselection.length);
    log("Subselection content: ", subselection.toJSON());
  }
});