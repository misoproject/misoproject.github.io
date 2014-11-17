var ds = new Miso.Dataset({
  url : "/data/crudeoil.csv",
  delimiter : ",",
  columns : [
    { name : "Year", type : "time", format : "YYYY" }
  ]
});

ds.fetch({
  success : function() {
    chart = new Highcharts.Chart({
      chart: {
        renderTo: 'lineChartContainer',
        type: 'line',
        marginRight: 130,
        marginBottom: 25
      },
      title: {
        text: 'World Crude Oil Barrel Production (1,000) per unit',
        x: -20 //center
      },
      subtitle: {
        text: 'Src: http://www.infochimps.com/datasets/world-crude-oil-production-1980-to-2004',
        x: -20
      },
      xAxis: {
        categories: _.map(this.column("Year").data, function(year) { 
          return year.format("YY"); 
        })
      },
      yAxis: {
        title: {
          text: this.columnNames()[1]
        },
        plotLines: [{
          value: 0,
          width: 10000,
          color: '#808080'
        }]
      },
      tooltip: {
        formatter: function() {
          return '<b>'+ this.series.name +'</b><br/>'+
          this.x +': '+ this.y;
        }
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -10,
          y: 100,
          borderWidth: 0
      },
      series: [{
          name: 'World Production',
          data: this.column("Crude oil production (1000 barrels per day)").data
      }]
    });
  }
});
