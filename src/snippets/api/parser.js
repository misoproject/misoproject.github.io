// Pass in the data you'll be parsing
// Take in any potential options you might need for your parser
Miso.Parsers.MyCustomParser = function(data, options) {};

_.extend(Miso.Parsers.MyCustomParser.prototype, Miso.Parsers.prototype, {
  parse : function(data) {

    // parse the data here
    // ...

    // return the following structure:
    return {
      columns : arrayOfColumnNames,
      data    : objectWithColumnToDataArrayMapping
    };
  }
});