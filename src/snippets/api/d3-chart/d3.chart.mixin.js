d3.chart("BarChartWithLabels", {
  initialize: function() {
    this.bars   = this.mixin("BarChart", this.base.append("g"));
    this.labels = this.mixin("LabelChart", this.base.append("g"));
  }
});