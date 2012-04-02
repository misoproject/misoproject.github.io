(function(global, _) {

  var Miso = (global.Miso || (global.Miso = {}));
  /**
  * @constructor
  * Google Spreadsheet Parser. 
  * Used in conjunction with the Google Spreadsheet Importer.
  * Requires the following:
  * @param {object} data - the google spreadsheet data.
  * @param {object} options - Optional options argument.
  */
  Miso.Parsers.GithubCommits = function(data, options) {
    this.options = options || {};
    this._data = data;
  };


  _.extend(Miso.Parsers.GithubCommits.prototype, Miso.Parsers.prototype, {

    parse : function(data) {
      var columns = ['sha', 
                     'url', 
                     'message', 
                     'committer_date',
                     'committer_name',
                     'committer_email'
          ], 
          dataColumns = [];
      console.log(data);

      return {
        columns : columns,
        data : dataColumns
      };
    }

  });
}(this, _));

