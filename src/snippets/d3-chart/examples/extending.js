/**
* 
* Renders circles along an x axis. For example:
* 
* var monthCircleChart = d3.select(output)
*   .append("svg")
*   .attr("height", 70)
*   .attr("width", 800)
*   .chart("CircleChart", {
*     dataMapping: {
*       value: function() { return this.month; }
*     }
*   })
*   .radius(3);
* 
* var data = [
*   { name : "January", month: 1, value : 29 },
*   { name : "February", month: 2, value : 32 },
*   { name : "March", month: 3, value : 48 },
* ];
* 
* circlechart.draw(data);
*/

d3.chart("CircleChart", {

  // these are the data attributes required by the chart.
  dataAttrs: ["value"],

  initialize: function() {

    var chart = this;

    // assign a css class name to the chart highest container
    // so that we can also style it
    chart.base.classed("CircleChart", true);

    // set up some basic defaults if user didn't provide them.
    chart._height   = chart._height || chart.base.attr("height");
    chart._width    = chart._width  || chart.base.attr("width");
    chart._radius   = chart._radius || 5;
    chart._dataAttribute = chart._dataAttribute || "value";

    // the x scale will be adjusted to fit all circles in.
    // we give it 2 radii worth of padding on each side.
    chart.xScale = d3.scale.linear()
      .range([
        chart.radius() * 2,
        chart.width() - (chart.radius() * 2)
      ]);

    // create a circle layer
    chart.layer("circles", this.base.append("g"), {

      dataBind: function(data) {
        var chart = this.chart();

        // find the min and max of our data values so we can
        // set the domain of the xScale.
        chart.xScale.domain(d3.extent(data, function(d) {
          return d.value;
        }));

        return this.selectAll("circle")
          .data(data);
      },

      insert: function() {
        return this.append("circle")
          .classed("circle", true);
      },

      events: {
        enter: function() {
          var chart = this.chart();
          // position the circles at the appropriate location
          // and set their size.
          return this.attr("cy", chart.height()/2)
            .attr("cx", function(d) {
              return chart.xScale(d.value);
            })
            .attr("r", chart.radius());
        }
      }

    });
  },

  // --- getters/setters.
  radius : function(newRadius) {
    if (arguments.length === 0) {
      return this._radius;
    }
    this._radius = newRadius;
    return this;
  },

  width: function(newWidth) {
    if (arguments.length === 0) {
      return this._width;
    }
    this._width = newWidth;
    return this;
  },

  height: function(newHeight) {
    if (arguments.length === 0) {
      return this._height;
    }
    this._height = newHeight;
    return this;
  }
});

/**
* 
* Renders circles along an x axis with labels
* above them.
* 
* var monthCircleChart = d3.select(output)
*   .append("svg")
*   .attr("height", 70)
*   .attr("width", 800)
*   .chart("LabeledCircleChart", {
*     dataMapping: {
*       value: function() { return this.month; }
*     }
*   })
*   .radius(3);
* 
* var data = [
*   { name : "January", month: 1, value : 29 },
*   { name : "February", month: 2, value : 32 },
*   { name : "March", month: 3, value : 48 },
* ];
* 
* circlechart.draw(data);
*/
d3.chart("CircleChart").extend("LabeledCircleChart", {

  dataAttrs: ["name"],

  initialize: function() {

    var chart = this;

    // assign a css class name to the chart highest container
    // so that we can also style it
    chart.base.classed("LabeledCircleChart", true);

    // create a labels layer
    this.layer("labels", this.base.append("g"), {
      dataBind: function(data) {
        return this.selectAll("text")
          .data(data);
      },
      insert: function() {
        return this.append("text")
          .attr("text-anchor", "middle")
          .classed("label", true);
      },
      events: {
        enter: function() {
          var chart = this.chart();

          // position the labels at the same x of the circle
          // but about two radii's worth above (Which really gives)
          // one radius worth of padding.
          return this.attr("x", function(d) {
            return chart.xScale(d.value);
          })
          .attr("y", (chart.height() / 2) - (chart.radius()*2))
          .text(function(d) {
            return d.name;
          })
          .style("font-size", "8pt");
        }
      }
    });
  }
});

// Render values:
var circlechart = d3.select(output)
  .append("svg")
  .attr("height", 70)
  .attr("width", 800)
  .chart("CircleChart", {
    dataMapping: {
      value: function() { return this.value; }
    }
  });

// Render the months as values:
var monthCircleChart = d3.select(output)
  .append("svg")
  .attr("height", 70)
  .attr("width", 800)
  .chart("LabeledCircleChart", {
    dataMapping: {
      value: function() { return this.month; },
      name: function() { return this.name; }
    }
  })
  .radius(3);


var data = [
  { name : "Jan", month: 1, value : 29 },
  { name : "Feb", month: 2, value : 32 },
  { name : "Mar", month: 3, value : 48 },
  { name : "Apr", month: 4, value : 49 },
  { name : "May", month: 5, value : 58 },
  { name : "Jun", month: 6, value : 68 },
  { name : "Jul", month: 7, value : 74 },
  { name : "Aug", month: 8, value : 73 },
  { name : "Sept", month: 9, value : 65 },
  { name : "Oct", month: 10, value : 54 },
  { name : "Nov", month: 11, value : 45 },
  { name : "Dec", month: 12, value : 35 }
];

circlechart.draw(data);
monthCircleChart.draw(data);