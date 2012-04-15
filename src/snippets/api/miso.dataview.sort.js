var ds = new Miso.Dataset({
  data: [ { one : 1, two : 4, three : 7 },
          { one : 2, two : 5, three : 8 },
        ]
});
ds.fetch();

log( ds.rowByPosition(0) );

ds.sort({ comparator: function(rowA, rowB) {
  if (rowA.three > rowB.three) { return -1; }
  if (rowA.three < rowB.three) { return 1;  }
  return 0;
}});

log( ds.rowByPosition(0) );
