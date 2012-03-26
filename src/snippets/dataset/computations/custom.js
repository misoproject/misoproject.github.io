// initialize a new dataset
var ds = new Miso.Dataset({
  data: { columns : [ 
    { name : "one", data : [10, 2, 3] },
    { name : "two", data : [1, 20, 3] }
  ] },
  strict: true
});

Miso.Dataset.prototype.random = function(columnNames) {
  
  // find all the columns in question
  var columns = [];
  _.each(columnNames, function(name) {
    columns.push(this.column(name));
  }, this);

  return this._calculated(columns, function(columns) {
    
    // return a function that when re-run over a set of
    // columns can recompute the value we're looking for
    return function() {

      // assemble all the data 
      // values into a single array temporarily
      var values = [];
      _.each(columns, function(column) {
        values.push(column.data);
      }, this);

      // flatten the values
      values = _.flatten(values);

      // get a random value from the total array of values
      // we gathered.
      return values[Math.floor(Math.random() * values.length)];
    }
  }(columns));
};

ds.fetch({
  success : function() {
    console.log(this.random(["one", "two"]));    
  }
});
