var ds = new Miso.Dataset({
  data : [
    { one : 12,  two : 40,  three : "2012 04_20" },
    { one : 1,   two : 40,  three : "2011 03_10" },
    { one : 102, two : 430, three : "2010 10_30" }
  ],
  columns : [
    { name : 'three', type : 'time', format : 'YYYY MM_DD' }
  ]
});
ds.fetch({ 
  success : function() {
    log(
      // assemble all the dates' toString results
      _.map(
        this.column('three').data, 
        function(date) {
          return date.toString();
        }
      )
    );
  }
});

