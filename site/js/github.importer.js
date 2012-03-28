(function(global, _) {

  var Miso = (global.Miso || (global.Miso = {}));
  /**
  * @constructor
  * Instantiates a new google spreadsheet importer.
  * @param {object} options - Options object. Requires at the very least:
  *     user - github username
  *     repo - github repository name
  */
  Miso.Importers.GithubCommits = function(options) {
    options = options || {};
    if (_.isUndefined(options.user)) {
      throw new Error("Set options 'user' property to point to a github username");
    }
    if (_.isUndefined(options.repo)) {
      throw new Error("Set options 'repo' property to point to a github repository");
    }

    options.url = 'https://api.github.com/repos/' + options.user + '/' + options.repo + '/commits';
        
    this.parser = Miso.Parsers.GithubCommits;
    this.params = {
      type : "GET",
      url : options.url,
      dataType : "jsonp"
    };

    return this;
  };

  _.extend(Miso.Importers.GithubCommits.prototype, Miso.Importers.Remote.prototype);

}(this, _));
