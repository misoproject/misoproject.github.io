var ds = new Miso.Dataset({
  data: [ 
    { one : 1, two : 4, three : 7 } 
  ]
});

ds.fetch({
  success: function() {
    // add a row
    this.add({ one: 7, two: null, three: null });
    log( this.toJSON() );
  }
});