var data = {
  totals: [
    { name : "Milk",  value : 40, p : 0.1  },
    { name : "Water", value : 80, p : 0.53 },
    { name : "Soda", value : 30, p : 0.37 }
  ]
};

var combo = d3.select(".ace-result")
  .chart('PieBarChart')
  .height(400)
  .width(400);

combo.draw(data.totals);
