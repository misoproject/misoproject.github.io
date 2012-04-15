var ds = new Miso.Dataset({
  data: [ { one : 1, two : 4, three : 7 } ]
});
ds.fetch();

ds.add({ one: 44, two: 9 });

log( ds.column('two').data );
log( ds.column('three').data );
