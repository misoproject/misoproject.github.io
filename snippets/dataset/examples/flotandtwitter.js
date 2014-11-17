// query twitter for tweets containing the term "javascript"
// and get 100 per page. 
var ds = new Miso.Dataset({
  url : "http://search.twitter.com/search.json?q=javascript&rpp=100&callback=",
  interval : 3000,
  jsonp : true,
  sync : true,

  // we only actually want the number of urls
  extract : function(data) {
    
    // add some properties to the tweets like the number of urls they have
    // and whether they have urls at all.
    _.each(data.results, function(tweet){
      tweet.urlCount = Math.max(tweet.text.split("http").length-1, 0);
      tweet.hasUrls  = (tweet.urlCount > 0) ? "Has Urls" : "Has No Urls";
    });

    return data.results;
  }
});

var urlRatioDataset = null;

ds.fetch({
  success : function() {       
    if (urlRatioDataset === null) {
      // compute a group by that aggregates the number of tweets that
      // do and don't have urls.
      urlRatioDataset = this.groupBy("hasUrls", ["urlCount"], { 
        method : function(arr) { 
          return arr.length; 
        }
      });

      var paintPieChart = function() {
        var series = [];
        

        // convert data to flot format:
        // { label : "", data : N }
        urlRatioDataset.each(function(row) {
          series.push({ label : row.hasUrls, data : row.urlCount });
        });
        
        log(series);

        // create a pie chart.
        // For more info see:
        // http://people.iola.dk/olau/flot/examples/pie.html
        $.plot($("#pieContainer"), 
          series,
          {  
            legend: {
              show: false
            },
            series: {
              pie: { 
                show: true,
                label: {
                  show: true,
                  radius: 1,
                  formatter: function(label, series){
                    return '<div style="font-size:10pt;text-align:center;padding:5px;color:black;">'+
                    label+
                    '<br/>'+Math.round(series.percent) +
                    '% ('+ series.datapoints.points[1] + ')</div>';
                  },
                  background: { opacity: 0.8 }
                }
              }
            }
          });
      };

      // subscribe to changes to the group by.
      urlRatioDataset.bind("change", paintPieChart);

      // render the chart the first time. Subsequent updates will go through
      // the change event.
      paintPieChart();
    }
    
  }
});