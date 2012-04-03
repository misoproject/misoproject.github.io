var ds = new Miso.Dataset({
  importer: Miso.Importers.GithubCommits,
  user : 'alexgraul',
  repo : 'dotvim',
  interval : 3000,
  jsonp : true,
});

ds.fetch();

