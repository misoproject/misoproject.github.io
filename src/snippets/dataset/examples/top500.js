var ds = new Miso.Dataset({
  url : "/data/top500.csv",
  delimiter : ","
});

ds.fetch({
  success: function() {

    var counts = ds.countBy('Country').sort({ comparator: function(r1, r2) {
      if ( r1.counts > r2.counts ) {return 1;}
      if ( r1.counts < r2.counts ) {return -1;}
      return 0;
    }});

    var topCoreCount = ds.groupBy('Country', ["Effeciency (%)", ]);

    $el.append([
      'The most powerful supercomputer in the world belongs to ',
      num( ds.rowByPosition(0).Country ),
      ' and the second most powerful to ',
      num( ds.rowByPosition(1).Country ),
      '. The', num ( counts.rowByPosition(0).Country ),
      'has the most supercomputers in the top500 with ',
      num( counts.rowByPosition(0).count ), ', the highest rated being',
      function() {
        var top = ds.rowById(counts.rowByPosition(0)._oids[0]);
        return [top.Name, 'at', top.Site, ' , built in ', top.Year,
                'by', top.Manufacturer].join(' ')
      }(),


      'The supercomputers in the top500 have an average of',
      num( ds.mean('Total Cores').toFixed() ),
      'cores running at', num( ds.mean('Processor Speed (MHz)').toFixed() ),
      'Mhz'
    ].join(' '));
  }
});

function num( val ) {
  return "<span style='color: #00f; font-weight: bold;'>" + val + "</span>";
}
var $el = $('#output p');

console.log('x');
