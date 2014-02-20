/**
* A bar chart. Required data format:
* [ { name : x-axis-bar-label, value : N }, ...]
*
*  Sample use:
*  var piegraph = d3.select('#piegraph')
*    .append('svg')
*    .chart('PieChart')
*    .height(300)
*    .width(300)
*    .radius(10)
*    .colors(d3.scale.category10());
*  piegraph.draw(piedata);
*/
d3.chart('PieChart', {

  initialize: function() {
    var chart = this;

    chart.base
      .classed('PieChart', true);

    // defaults
    chart.data = null;

    var slices_base = chart.base.append('g')
      .classed('slices', true);

    chart.layer('slices', slices_base, {
      dataBind: function(data) {
        var chart = this.chart();
        return this.selectAll('path')
          .data(chart.pie(data));
      },
      insert: function() {
        var chart = this.chart();
        return this.append('path')
          .classed('slice', true)
          .attr('fill', function(d, i) {
            return chart.colorScale(i);
          });

      }
    });

    var onData = function() {
      return this.attr('d', chart.arc);
    };

    chart.layer('slices').on('enter', onData);
    chart.layer('slices').on('update', onData);

    var onDimentionChange = function() {
      slices_base.attr('width', chart.width())
      .attr('height', chart.height())
      .attr('transform', 'translate('+chart.width()/2+','+chart.height()/2+')');
    };
    chart.on("change:height", onDimentionChange);
    chart.on("change:width", onDimentionChange);
  },

  radius : function(newRadius) {
    if (!arguments.length) {
      return this.r;
    }
    this.r = newRadius;
    if (this.data) this.draw(this.data);

    return this;
  },

  colors: function(colorScale) {
    if (!arguments.length) {
      return this.colorScale;
    }
    if (colorScale instanceof Array) {
      colorScale = d3.scale.ordinal()
        .range(colorScale)
        .domain([0, colorScale.length-1]);
    }
    this.colorScale = colorScale;
    if (this.data) this.draw(this.data);

    return this;
  },

  height: function(newHeight) {
    if (!arguments.length) {
      return this.w;
    }
    // save new height
    this.h = newHeight;

    // adjust the base height
    this.base.attr('height', this.h);

    this.trigger("change:height");
    if (this.data) this.draw(this.data);

    return this;
  },

  width: function(newWidth) {
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

  transform: function(data) {
    this.data = data;

    this.arc = d3.svg.arc()
      .outerRadius(this.r);

    this.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    return data;

  }
});
