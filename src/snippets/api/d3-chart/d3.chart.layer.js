d3.chart("CircleChart", {
  initialize: function() {
    // add a circles layer
    this.layer(
      // layer name:
      "circles",

      // give it a container off of the base
      this.base.append("g"),

      // key layer methods: dataBind, insert and events
      {
        // define the data binding function
        dataBind: function(data) {
          return this.selectAll("circle")
            .data(data);
        },
        // define the element inserting 
        insert: function() {
          return this.append("circle");
        },
        // define the life cycle events
        events: {
          enter : function() {
            this.attr("cx", function(d) {
              return d;
            }).attr("cy", 10)
              .attr("r", 4);
          }
        }
      }
    );
  }
});