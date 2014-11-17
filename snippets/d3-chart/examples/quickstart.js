// define a new chart type: a circle chart
d3.chart("CircleChart", {

  initialize: function() {
    // create a layer of circles that will go into
    // a new group element on the base of the chart
    this.layer("circles", this.base.append("g"), {

      // select the elements we wish to bind to and
      // bind the data to them.
      dataBind: function(data) {
        return this.selectAll("circle")
          .data(data);
      },

      // insert actual circles
      insert: function() {
        return this.append("circle");
      },

      // define lifecycle events
      events: {

        // paint new elements, but set their radius to 0
        // and make them red
        "enter": function() {
          this.attr("cx", function(d) {
            return d * 10;
          })
          .attr("cy", 10)
          .attr("r", 0)
          .style("fill", "red");
        },
        // then transition them to a radius of 5 and change
        // their fill to blue
        "enter:transition": function() {
          var chart = this.chart();
          this.delay(500)
            .attr("r", 5)
            .style("fill", chart.color());
        }
      }
    });
  },

  // set/get the color to use for the circles as they are
  // rendered.
  color: function(newColor) {
    if (arguments.length === 0) {
      return this._color;
    }
    this._color = newColor;
    return this;
  }
});

// create an instance of the chart on a d3 selection
var chart = d3.select('.ace-result')
  .append("svg")
  .attr("height", 30)
  .attr("width", 400)
  .chart("CircleChart")
  .color("orange");

// render it with some data
chart.draw([1,4,6,9,12,13,30]);