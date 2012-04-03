// query twitter for tweets containing the term "javascript"
// and get 100 per page.
var sequence = 0,
  punctuations = {
  "question" : /\?/g,
  "exclamation" : /\!/g,
  "ellipsis" : /\.\.\./g
};

var ds = new Miso.Dataset({

  // fetch only tweets that come after the last tweet we fetched.
  url : function() {
    var u = "http://search.twitter.com/search.json?q=javascript&rpp=100";
    if (!_.isUndefined(this.since_id)) {
      u = u + "&since_id=" + this.since_id;
    }
    return u + "&callback=";
  },

  interval : 1000,
  jsonp : true,
  sync : true,

  // we only actually want the number of urls
  extract : function(data) {
    
    // add some properties to the tweets like the number of urls they have
    // and whether they have urls at all.
    _.each(data.results, function(tweet){
      _.each(punctuations, function(regex, name) {
        if (regex.test(tweet.text)) {
          tweet[name] = tweet.text.match(regex).length / data.results.length;
        } else {
          tweet[name] = 0;  
        }

      });

      // save the request sequence id. We are going to group by request.
      tweet.sequence = sequence;
    });

    // save the last query id
    this.since_id = data.results[data.results.length-1].id_str;
    return data.results;
  }
});

var punctuationDataset = null, paintChart, graph, legend;

ds.fetch({
  success : function() {      
    sequence++;

    if (punctuationDataset === null) {
      
      // compute a group by that aggregates the tweets into counts for each
      // type of punctuation.
      punctuationDataset = this.groupBy("sequence", _.keys(punctuations));
      
      paintChart = function() {
        $("#pieContainer").children().remove();
        graph = new Rickshaw.Graph({
          element: $("#pieContainer")[0], 
          width: 500, 
          height: 270, 
          renderer : 'bar',
          series: prepareData(punctuationDataset, "sequence", _.keys(punctuations))
        });
           
        graph.render();
      };

      // subscribe to changes to the group by.
      punctuationDataset.bind("change", paintChart);
    }
    
    if (sequence >= 3) {
      // render the chart the first time. Subsequent updates will go through
      // the change event.
      paintChart();

      // draw legend just once.
      if (_.isUndefined(legend)) {
        legend = new Rickshaw.Graph.Legend( {
          element: $('#legend')[0],
          graph: graph
        });  
      }
    }
  }
});

// because rickshaw expects all the data in x & y formats for every series,
// we need to transform the data into the following format:
function prepareData(dataset, x, y) {

  if (!_.isArray(y)) {
    y = [y];
  }
  var colors = ['rgba(36,137,64,1)', 'rgba(143,188,43,1)', 'rgba(101,132,47,1)'];
  var series = [];
  _.each(y, function(seriesName, i){

    var s = { data : [] ,  color: colors[i], name : seriesName };

    dataset.each(function(row) {
      var p = {};
      p.x = row[x];
      p.y = row[seriesName];
      s.data.push(p);
    });

    series.push(s);
  });
  return series;
}