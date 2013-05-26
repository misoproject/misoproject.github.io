d3.chart("BarChartWithLabels", {
  initialize: function() {
    this.bars   = this.mixin(this.base.append("g"), "BarChart");
    this.labels = this.mixin(this.base.append("g"), "LabelChart");
  }
});