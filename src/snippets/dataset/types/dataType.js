var ds = new Miso.Dataset({
  data : [
    { count : 12,  total : "40",  timestamp : "2012 04_20" },
    { count : 1,   total : "40",  timestamp : "2011 03_10" },
    { count : 102, total : "430", timestamp : "2010 10_30" }
  ],
  columns : [
    { name : 'total', type : 'number' },
    { name : 'timestamp', type : 'time', format : 'YYYY MM_DD' }
  ]
});
ds.fetch({ 
  success : function() {
    log(this.toJSON());
  }
});