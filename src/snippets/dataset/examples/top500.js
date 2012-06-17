var ds = new Miso.Dataset({
  url : "/data/top500_nov10.csv",
  delimiter : ","
});

var $el = $('#output p').empty();
ds.fetch({
  success: function() {

    var counts = ds.countBy('Country').sort({ comparator: function(r1, r2) {
      if ( r1.counts > r2.counts ) {return 1;}
      if ( r1.counts < r2.counts ) {return -1;}
      return 0;
    }});

    $el.append([
      'The most powerful supercomputer in the world belongs to ',
      b( ds.rowByPosition(0).Country ),
      ' and the second most powerful to ',
      b( ds.rowByPosition(1).Country ),
      '. The', b( counts.rowByPosition(0).Country ),
      'has the most supercomputers in the top500 with ',
      b( counts.rowByPosition(0).count ), ', the highest rated being',
      function() {
        var top = ds.rowById(counts.rowByPosition(0)._oids[0]);
        return [b(top.Name), 'at', b(top.Site), ' , built in ', b(top.Year),
                'by', b(top.Manufacturer)].join(' ')
      }(),


      'The supercomputers in the top500 have an average of',
      b( ds.mean('Total Cores').toFixed() ),
      'cores running at', b( (ds.mean('Processor Speed (MHz)') / 1000).toPrecision(2) ),
      'Ghz. The fastest cores are running at ', b( (ds.max('Processor Speed (MHz)') / 1000).toPrecision(2) ), 'Ghz.',

      function() {
        var segmentsCounts = ds.countBy('Segment').sort(function(a,b) {
          if (a.count < b.count) { return 1; };
          if (a.count > b.count) { return -1; };
          return 0;
        });

        var segmentsPower = ds.groupBy('Segment', ['Rmax']).sort(function(a,b) {
          if (a.Rmax < b.Rmax) { return 1; };
          if (a.Rmax > b.Rmax) { return -1; };
          return 0;
        });

        var topCount = segmentsCounts.rowByPosition(0);
        var topPower = segmentsPower.rowByPosition(0);
        var topCountPower = segmentsPower
          .rows(function(row) { return row.Segment === topCount.Segment })
          .rowByPosition(0);
        var topPowerCount = segmentsCounts
          .rows(function(row) { return row.Segment === topPower.Segment })
          .rowByPosition(0);
        return [
          'The most common market segment for the supercomputers is',
          b(topCount.Segment), 
          'with', 
          b( ((topCount.count / ds.length) * 100).toPrecision(3) ),
          '% of the total but',
          b(topPower.Segment), 
          'has', 
          b( (topPower.Rmax / topCountPower.Rmax).toPrecision(4) ), 
          'times the total rMax power',
          'with only', 
          b( ((topPowerCount.count / ds.length) * 100).toPrecision(3) ), 
          '% of the total entries in the top 500.'
        ].join(' ')

      }()
    ].join(' '));
  }
});

function b( val ) {
  return "<span style='font-weight: bold;'>" + val + "</span>";
}

