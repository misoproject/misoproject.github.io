/**
* A bar chart. Required data format:
* [ { name : x-axis-bar-label, value : N }, ...]
*
*  Sample use:
*  var piebarchart = d3.select('#piebarchart')
*    .append('svg')
*    .chart('PieBarChart')
*  piebarchart.draw(piedata);
*/
d3.chart("PieBarChart", {
  initialize: function() {

    var chart = this;

    var svg = chart.base.append("svg");
    var bases = {
      bar: svg.append("g").classed("bar", true),
      pie: svg.append("g").classed("pie", true)
    };

    chart.charts = {
      bargraph : bases.bar
        .chart('Barchart')
        .yFormat(d3.format("d")),

      piechart : bases.pie
        .chart('PieChart')
        .colors(d3.scale.category10())
    };

    chart.attach("bar", chart.charts.bargraph);
    chart.attach("pie", chart.charts.piechart);

    chart.on("change:width", function() {
      svg.style("width", chart.width());
      chart.charts.bargraph.width(chart.width());
      chart.charts.piechart
        .width(chart.width())
        .radius((Math.min(chart.width(), chart.height())/4) - 10);

    });

    chart.on("change:height", function() {
      svg.style("height", chart.height());
      bases.pie.attr("transform",
        "translate(0," + (chart.height()/4) + ")");
      chart.charts.bargraph.height(chart.height()/2);
      chart.charts.piechart
        .height(chart.height()/2)
        .radius((Math.min(chart.width(), chart.height())/4) - 10);
    });
  },

  demux: function(name, data) {
    if (name === "bar") {
      return data;
    } else {
      return data.map(function(d) {
        return { name : d.name, value: d.p };
      });
    }
  },

  width : function(newWidth) {

    if (!arguments.length) {
      return this.w;
    }
    // save new width
    this.w = newWidth;

    // adjust the base width
    this.base.attr('width', this.w);
    this.trigger("change:width");

    if (this.data) this.draw(this.data);

    return this;
  },

  height : function(newHeight) {
    if (!arguments.length) {
      return this.h;
    }

    // save new height
    this.h = newHeight;

    // adjust the base width
    this.base.attr('height', this.h);
    this.trigger("change:height");

    if (this.data) this.draw(this.data);
    return this;
  },
});
