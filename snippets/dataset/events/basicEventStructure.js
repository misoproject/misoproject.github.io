var ds = new Miso.Dataset({
  data : [
    { one : 12,  two : 40,  three : 40 },
    { one : 10, two : 32, three : 2 }
  ],
  sync : true
});

_.when(ds.fetch()).then(function() {
  
  ds.subscribe("add", function(event) {
    log(JSON.stringify(event));
    log("Is Add?", Miso.Dataset.Event.isAdd(event.deltas[0]));
    log("Is Remove?", Miso.Dataset.Event.isRemove(event.deltas[0]));
    log("Is Update?", Miso.Dataset.Event.isUpdate(event.deltas[0]));
  });

  ds.add({ one : 10, two : 3, three : 24 });

  ds.subscribe("remove", function(event) {
    // We will now have an event with two deltas!
    log(event.deltas);
    log("New Dataset Length", ds.length);
  });

  log("Pre Remove Dataset Length", ds.length);
  ds.remove(function(row) {
    return (row.one === 10);
  });
});