var layer = d3.select(output)
  .append("svg")
  .attr("height", 100)
  .attr("width", 100)
  .append("g")
  .attr("name", "theGroup")
  .layer({
    dataBind: function(data) {
      return this.selectAll("text").data(data);
    },
    insert: function() {
      return this.append("text");
    },
    events: {
      enter: function() {
        console.log(this.base.attr("name"));
        this.text(this.base.attr("name"));
      }
    }
  });

layer.draw([10]);