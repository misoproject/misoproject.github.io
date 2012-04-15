var ds = new Miso.Dataset({
  data: [ { one : 1, two : 4, three : 7 },
          { one : 2, two : 5, three : 8 },
        ]
});
ds.fetch();

var oneTwo = ds.where({
  columns: ['one'],
  rows: function(row) {
    return row.one > 1;
  }
});

log( oneTwo.length, oneTwo.column('one').data );
