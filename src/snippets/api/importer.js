Miso.Importers.MyCustomImporter = function(options) {
  // save your options
  // overwrite 'extract' function if you want.
};

_.extend(Miso.Importers.MyCustomImporter.prototype, {
  
  // options should handle a success and error callback.
  // fetch should return a deferred object if this is a remote
  // call.
  // Either one of the callbacks should call the success callback
  // with the returned data.
  fetch : function(options) {}
});