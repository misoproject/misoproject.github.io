var ds = new Miso.Dataset({
  data : [
    { one : 12,  two : 40,  three : 40 }
  ],
  sync : true
});

_.when(ds.fetch()).then(function() {
  ds.bind("add", function(event) {
    console.log(JSON.stringify(event));
    console.log("Is Add?", Miso.Event.isAdd(event.deltas[0]));
    console.log("Is Remove?", Miso.Event.isRemove(event.deltas[0]));
    console.log("Is Update?", Miso.Event.isUpdate(event.deltas[0]));
  });

  // Add two rows - add event will be triggered twice.
  ds.add({ one : 10, two : 32, three : 2 });
  ds.add({ one : 10, two : 3, three : 24 });

  ds.bind("remove", function(event) {
    // We will now have an event with two deltas!
    console.log(event.deltas);
    console.log("New Dataset Length", ds.length);
  });

  console.log("Pre Remove Dataset Length", ds.length);
  ds.remove(function(row) {
    return (row.one === 10);
  });

});