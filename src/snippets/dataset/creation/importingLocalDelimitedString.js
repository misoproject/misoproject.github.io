var myData = "state,population\n"+
       "Alabala,4802740\n" +
       "Massachusetts,6587536";

var ds = new Miso.Dataset({
  data : myData,
  delimiter : ","
});

ds.fetch({ success : function() {
  console.log(ds.columnNames());
  console.log(ds.column("state").data);
  console.log(ds.column("population").data);
}});