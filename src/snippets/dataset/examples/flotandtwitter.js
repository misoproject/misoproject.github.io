// query twitter for tweets containing the term "javascript"
// and get 100 per page. Note that twitter uses jsonp requests, 
// so we toggle that flag too.
var ds = new Miso.Dataset({
  url : "http://search.twitter.com/search.json?q=javascript&rpp=100&callback=",
  interval : 3000,
  jsonp : true,
  sync : true,

  // we only actually want the number of urls
  extract : function(data) {
    
    _.each(data.results, function(tweet){
      tweet.urlCount = Math.max(tweet.text.split("http").length-1, 0);
      tweet.hasUrls  = (tweet.urlCount > 0);
    });

    return data.results;
  }
});

var urlRatioDataset = null;

ds.fetch({
  success : function() {       
    if (urlRatioDataset === null) {
      urlRatioDataset = this.groupBy("hasUrls", ["urlCount"], { 
        method : function(arr) { 
          return arr.length; 
        }
      });
    }
    console.log(urlRatioDataset.syncable);
    console.log(urlRatioDataset.column("urlCount").data);
  }
});