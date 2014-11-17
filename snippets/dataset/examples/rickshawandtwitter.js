// query twitter for tweets containing the term "javascript"
// and get 100 per page.
var sequence = 0,
  punctuations = {
  "question" : /\?/g,
  "exclamation" : /\!/g,
  "ellipsis" : /\.{3,}|\u2026/g
}, colors = ['rgba(36,137,64,1)', 'rgba(143,188,43,1)', 'rgba(101,132,47,1)'];

var ds = new Miso.Dataset({
  // poll twitter every second.
  interval : 1000,
  jsonp : true,

  // enable syncing behavior since we'll be building a groupBy off of the original
  // data that we want to have update on every poll.
  sync : true,

  // fetch only tweets that come after the last tweet we fetched.
  url : function() {
    var u = "http://search.twitter.com/search.json?q=javascript&rpp=100";

    // If we have a previous tweet id saved, make sure we restart our query from
    // that point on. This means we might not get the full 100 tweets we want.
    if (!_.isUndefined(this.sinceId)) {
      u = u + "&since_id=" + this.sinceId;
    }
    return u + "&callback=";
  },

  // we only actually want the number of urls
  extract : function(data) {

    // add some properties to the tweets like the number of urls they have
    // and whether they have urls at all.
    _.each(data.results, function(tweet){

      // for each punctuation type, see if it appears in the tweet. If so
      // save the number of times it appears. Otherwise just set it to zero
      // for that tweet.
      _.each(punctuations, function(regex, name) {
        if (regex.test(tweet.text)) {
          tweet[name] = tweet.text.match(regex).length;
        } else {
          tweet[name] = 0;
        }
      });

      // save the request sequence id. We are going to group by request.
      tweet.sequence = sequence;
    });

    // save how large this result was. We are going to use it to normalize later to 100
    // which is the highest number of tweets we can have.
    this.lastRequestSize = data.results.length;

    // save the last query id
    this.sinceId = data.results[data.results.length-1].id_str;

    return data.results;
  }
});

var punctuationDataset, paintChart, graph, legend;

ds.fetch({
  success : function() {

    // if this is our first success callback, we need create the
    // groupBy dataset.
    if (_.isUndefined(punctuationDataset)) {

      // compute a group by that aggregates the tweets into counts for each
      // type of punctuation.
      punctuationDataset = this.groupBy("sequence", _.keys(punctuations), {

        // we are overriding the default sum method to normalize the count
        // to 100, which is the max amount of tweets. Because we're using since_id
        // we might actually get a smaller set.
        method : function(arr) {
          return (_.sum(arr) / this.parent.importer.lastRequestSize) * 100;
        }
      });

      // define a function painting routine.
      paintChart = function() {

        // clear previously rendered chart here.
        var pieContainer = $("#pieContainer");
        pieContainer.empty();

        // create a new graph with the latest version of the data.
        graph = new Rickshaw.Graph({
          element: pieContainer[0],
          width: 500,
          height: 270,
          renderer : 'bar',
          series: prepareData(punctuationDataset, "sequence", _.keys(punctuations))
        });

        graph.render();
      };
    }

    // wait for 3 requests to come in before painting original chart
    // otherwise we are just painting one giant bar....!
    if (sequence === 3) {

      // subscribe to changes to the group by which will run
      // the above repaint function.
      punctuationDataset.bind("change", paintChart);

      // render the chart the first time. Subsequent updates will go through
      // the change event. We are waiting a few
      paintChart();

      // draw legend just once.
      if (_.isUndefined(legend)) {
        legend = new Rickshaw.Graph.Legend({
          element: $('#legend')[0],
          graph: graph
        });
      }
    }

    // increase our request counter.
    sequence++;
  }
});

// because rickshaw expects all the data properties to have the keys 'x' and 'y' for
// for every series, we need to transform the data from a format like so (if x is 'a' and
// the series are 'b' and 'c'):
// [ { a : 1, b : 2, c : 3 }] => [ { data : [ { x : 1, y : 2 } ]}, { data : [ { x : 1, y : 3 } ]}]
function prepareData(dataset, x, y) {

  // convert the series to an array if it isn't.
  if (!_.isArray(y)) {
    y = [y];
  }

  // for each series, create the required format.
  return _.map(y, function(seriesName, i){
    var s = { data : [] ,  color: colors[i], name : seriesName };

    dataset.each(function(row) {
      var p = {};
      p.x = row[x];
      p.y = row[seriesName];
      s.data.push(p);
    });

    return s;
  });
}
window.ds = ds;
