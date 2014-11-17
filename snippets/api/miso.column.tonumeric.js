var col = new Miso.Dataset.Column({ 
  name: 'inoculated', 
  type: 'boolean', 
  data: [true, false, false, true] 
});

log ( col.toNumeric(0, 2) );
