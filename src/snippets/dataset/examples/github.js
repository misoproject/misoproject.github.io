var GH = {};
GH.CommitsParser = function(options) {
  options = options || {}; 
}

_.extend(GH.CommitsParser.prototype, Miso.Parsers.prototype, {
  parse : function(data) {
    // we really only want to grab a few data points from the entire
    // api call result.
    var columns     = ['sha', 'date', 'committer'],
        dataColumns = {};

    _.each(data, function(c) {

      dataColumns.sha       = dataColumns.sha || [];
      dataColumns.date      = dataColumns.date || [];
      dataColumns.committer = dataColumns.committer || [];

      dataColumns.sha.push(c.sha);
      dataColumns.date.push(c.commit.committer.date);
      dataColumns.committer.push(c.committer.login)
    });

    return {
      columns : columns,
      data    : dataColumns
    };
  }
});

var ds = new Miso.Dataset({
  url : "https://api.github.com/repos/iros/deck.js-codemirror/commits?callback=",
  jsonp : "true",
  parser : GH.CommitsParser,
  extract : function(response) {
    return response.data;
  },
  columns : [
    { 
      name : 'date', 
      type : 'time', 
      format : 'YYYY-MM-DD', 
      before : function(date) {
        // let's roll the dates back to the beginning of the week, since we
        // just want the count of commits per week.
        var incomingFormat = 'YYYY-MM-DDThh:mm:ssZZ';
        var d = moment(date, incomingFormat);

        // take the day we have, and subtract from the number of days
        // into the week that it is. So if Saturday is the 6th day, it will
        // roll the date back 6 days.
        return d.subtract('days', d.day()).format(this.format);
      } 
    }
  ]
});

ds.fetch({ success : function() {

  var commitsByDay = this.groupBy("date", ["sha"], { 
    // we want the result of this group by to actually just be the number of
    // commits that match each date. We could accomplish this also with a countBy
    // but we wanted to demonstrate the power of the method property.
    method : function(array) {
      return array.length;
    }
  });

  // even though we're aggregating by week, we might actually not have 
  // counts for certain weeks! We're trying to build a consistent time series of 
  // week long intervals, so let's fill it in with zeros.
  var lastDate  = commitsByDay.rowByPosition(0).date.subtract('days', 7),
      firstDate = commitsByDay.rowByPosition(commitsByDay.length-1).date.add('days', 7);

  while(firstDate < lastDate) {
    
    // check, do we have a row for this date?
    var rowForDate = commitsByDay.where({ rows : function(row) {
      return row.date.valueOf() === firstDate;
    }})

    // if not, then just add a row with a zero count.
    if (rowForDate.length === 0) {
      commitsByDay.add({
        date : firstDate,
        sha  : "0"
      });
    }

    // keep incrementing the date until we pass our end date.
    firstDate.add('days', 7);
  }

  // now, we should make sure the list is sorted by dates, since we've been arbitrarily
  // adding rows of 0s to the end!
  commitsByDay.sort({ comparator : function(row1, row2) {
    if (row1.date.valueOf() < row2.date.valueOf())   { return -1; }
    if (row1.date.valueOf() > row2.date.valueOf())   { return  1; }
    if (row1.date.valueOf() === row2.date.valueOf()) { return  0; }
  }});

  $('#barChartContainer').children().remove();
  $('#barChartContainer').sparkline(commitsByDay.column('sha').data, {
    type : 'line',
    height: '100px',
    width: $('#barChartContainer').width()
  }); 

}});