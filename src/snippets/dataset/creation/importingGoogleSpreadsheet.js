var ds = new Miso.Dataset({
  importer : Miso.Dataset.Importers.GoogleSpreadsheet,
  parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
  key : "0Asnl0xYK7V16dFpFVmZUUy1taXdFbUJGdGtVdFBXbFE",
  worksheet : "1"
});

ds.fetch({ 
  success : function() {
    log(ds.columnNames());
  },
  error : function() {
    log("Are you sure you are connected to the internet?");
  }
});