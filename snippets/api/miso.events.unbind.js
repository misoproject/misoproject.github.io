var ds = new Miso.Dataset({
  sync: true
});

ds.bind('change', function() {
  log('change event triggered');
});

ds.trigger('change');

ds.unbind('change')

//Nothing triggered
ds.trigger('change')
