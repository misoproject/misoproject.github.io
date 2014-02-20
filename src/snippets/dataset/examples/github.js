
var GH = {};

// to parse the incomming github data we are creating a custom parser
// to handle any future Github commit data.
GH.CommitsParser = function(options) {};

// a custom parser only needs extend the base Miso.Dataset.Parsers.prototype
// and provide a parse method that takes in the data and returns
// an object containint a column name array and a data object
// containing the data for each column.
_.extend(GH.CommitsParser.prototype, Miso.Dataset.Parsers.prototype, {
  parse : function(data) {

    // we really only want to grab a few data points from the entire
    // api call result.
    var columns     = ['sha', 'date', 'committer'],
        dataColumns = { sha : [], date : [], committer : [] };

    _.each(data, function(c) {
      dataColumns.sha.push(c.sha);
      dataColumns.date.push(c.commit.committer.date);
      dataColumns.committer.push(c.committer.login);
    });

    return {
      columns : columns,
      data    : dataColumns
    };
  }
});

var ds = new Miso.Dataset({
  url : 'https://api.github.com/repos/misoproject/dataset/commits?callback=',
  jsonp : true,
  // the extract method will be called once the import is done, before
  // we try to parse it because the github callback is actually under a
  // property called 'data' in the response.
  extract : function(response) {
    return response.data;
  },
  parser : GH.CommitsParser,
  columns : [
    {
      name : 'date',
      type : 'time',

      // This is the format we're going to output the data from the
      // before function, NOT the incoming data.
      format : 'YYYY-MM-DD',

      // Before we actually parse the dates, let's roll them back to the
      // beginning of the week since we just want the count of commits
      // per week.
      before : function(date) {

        // this is the format the data actually comes in from github in.
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

ds.fetch({
  success : function() {

    // Aggregate the commit count by the date.
    var commitsByDay = this.countBy('date'),

        // even though we're aggregating by week, we might actually not have
        // counts for certain weeks! We're trying to build a consistent time series of
        // week long intervals, so let's fill it in with zeros.
        lastDate  = commitsByDay.rowByPosition(0).date.subtract('days', 7),
        firstDate = lastDate.subtract('months', 3),
        barContainer = $('#barChartContainer');

    while(firstDate < lastDate) {

      // check, do we have a row for this date?
      var rowsForDate = commitsByDay.where({
        rows : function(row) {
          return row.date.valueOf() === firstDate;
        }
      });

      // if not, then just add a row with a zero count.
      if (rowsForDate.length === 0) {
        commitsByDay.add({
          date : firstDate,
          count  : 0
        });
      }

      // keep incrementing the date until we pass our end date.
      firstDate.add('days', 7);
    }

    // now, we should make sure the list is sorted by dates, since we've been arbitrarily
    // adding rows of 0s to the end!
    commitsByDay.sort(function(row1, row2) {
      if (row1.date.valueOf() < row2.date.valueOf())   { return -1; }
      if (row1.date.valueOf() > row2.date.valueOf())   { return  1; }
      if (row1.date.valueOf() === row2.date.valueOf()) { return  0; }
    });

    // Clear any existing sparklines in the div.

    barContainer.empty()
      .sparkline(commitsByDay.column('count').data, {
        type : 'line',
        height: '100px',
        width: barContainer.width()
      }
    );

  }
});