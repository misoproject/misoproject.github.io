d3.chart("CircleChart", {
  initialize: function() {
    log("The base name attribute is set to: " + this.base.attr("name"));
  }
});

var chart = d3.select(output)
  .append("p")
  .attr("name", "LeParagraph")
  .chart("CircleChart");