var col = new Miso.Column({ 
  name: 'amount', 
  type: 'number', 
  data: [2, 3, '4'] 
});

log (col.data);
col.coerce();
log (col.data);