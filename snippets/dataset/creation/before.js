var data = [
  { a : 1, amount : "$23,444" }, 
  { a : 2, amount : "$290"    }, 
  { a : 5, amount : "$1,000"   }
];

var ds = new Miso.Dataset( {
  data : data, 
  columns : [
    { 
      name : "amount", 
      type : "number", 
      before : function(v) {
        // remove dollar signs and commas
        return v.replace(/\$|\,/g, '');
      }
    }
  ]
});

ds.fetch({ 
  success : function() {
    log(this.toJSON());
  }
});