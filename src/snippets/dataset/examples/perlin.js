// define the dimensions of our grid
var x_size = 50;
var y_size = 50;
var boxSize = 10;

// create our noise maker
var sn = new SimplexNoise();

var matrix = new Miso.Dataset();

// we are going to create a column for all the Y values
for (var row = 0; row < x_size; row++) {
  matrix.addColumn({
    name : row,
    type : 'number'
  });
}

// now make some values!
for (var column = 0; column < y_size; column++) {
  var rowObject = {};
  matrix.eachColumn(function(columnName, columnObject, rowindex) {
    rowObject[columnName] = sn.noise(column, rowindex);
  });
  matrix.add(rowObject);
}

// save the min and max from the dataset
var minNoise = matrix.min(),
    maxNoise = matrix.max();

// now we need to map a color to the noise ranges
function getColorFromNoise(noise) {
  var ratio = (noise - minNoise) / (maxNoise - minNoise);
  var v = Math.floor((255) * ratio);
  return 'rgba(' + v + ',' + v + ',' + v + ', 1)';
}

// now we have a matrix with lots of perlin noise
// lets visualize it!
// console.profile("Rendering");
var container = $('<div>', {
      "class" : "matrixContainer"
    }).css({ width : x_size * boxSize });

container.appendTo($('#perlinContainer'));

function buildRow(column) {

  // create a div container row
  var containerRow = $('<div>', { "class" : "matrixRow" })
    .css({ width : x_size * boxSize, display : 'none' })
    .appendTo(container);

  // create actual noise blocks and append them to the row
  _.each(column.data, function(value, x) {
    var noiseBox = $('<div>', { "class" : "noiseBox" });
    noiseBox.css({
      height: boxSize,
      width : boxSize,
      float: "left",
      "background-color" : getColorFromNoise(value)
    }).appendTo(containerRow);
  });

  return containerRow;
}

// aggregate rows into an array that we can then paint progressively
var containerRows = [];
matrix.eachColumn(function(colName, column, y) {
  containerRows.push(buildRow(column));
});

// delay each row painting by an index based offset to
// create a progressive load.
_.each(containerRows, function(cont, i) {
  setTimeout(function() {
    cont.fadeIn("slow");
  }, i * 100);
});
