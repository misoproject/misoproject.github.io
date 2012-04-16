var data = {
  metadata : { 
    about : "Some info about this data "
  },
  // this is our actual data!
  results : [
    { a : 1, b : 2 },
    { a : 2, b : 3 },
    { a : 3, b : 30 }
  ]
};

var ds = new Miso.Dataset({ 
  data : data,
  // extract the data first, then parse it.
  extract : function(data) {
    return data.results;
  }
});

ds.fetch({ 
  success : function() {
    log(this.toJSON());
  }
});