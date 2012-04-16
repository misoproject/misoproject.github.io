var ds = new Miso.Dataset({
  data: [ { one : 1, two : 4, three : 7 } ]
});

ds.fetch({
  success: function() {
   this.apply( [{ one: 7, two: null, three: null }] );
   log( this.column('one').data );
  }
});


