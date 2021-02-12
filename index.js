console.clear();

var n = 2, // number of layers
  m = 500, // number of samples per layer
  k = 1; // number of bumps per layer

function random0_9() {
  return Math.floor(Math.random() * 10);
}

var stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetNone);

const hight = [70, 73, 76, 79, 82, 85, 88, 91, 94, 100];
const medium = [46, 48, 50, 52, 54, 56, 58, 60, 62, 64];
const medium2 = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5];
const low = [0.1, 0.2, 0.3, 0.5, 0.8, 1, 1.5, 2, 2.5, 3];

function randomData() {
  let _arr = [];
  let _arr2 = [];
  for (let i = 0; i < m; i++) {
    _arr[i] = medium2[random0_9()];
    _arr2[i] = low[random0_9()];

    if (random0_9() % 3 === 0 && random0_9() % 5 === 0) {
      _arr[i] = medium2[random0_9()];
    }
    if (random0_9() % 3 === 0 && random0_9() % 7 === 0) {
      _arr[i] = hight[random0_9()];
    }
    if (random0_9() % 3 === 0 && random0_9() % 8 === 0) {
      _arr[i] = 0;
    }

    if (random0_9() % 3 === 0 && random0_9() % 6 === 0) {
      _arr2[i] = medium[random0_9()];
    }
    if (random0_9() % 3 === 0 && random0_9() % 6 === 0) {
      _arr2[i] = 1;
    }
  }
  
  return [ _arr, _arr2 ]
}

const _bump = randomData();

var layers = stack(d3.transpose(_bump));
console.log(_bump);

var svg = d3.select("svg");
var width = +svg.attr("width");
var height = +svg.attr("height");

var x = d3
  .scaleLinear()
  .domain([0, m - 1])
  .range([0, width]);

var y = d3
  .scaleLinear()
  .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
  .range([height, 0]);

var z = d3.interpolateReds;

var area = d3
  .area()
  .x((d, i) => x(i))
  .y0((d) => y(d[0]))
  .y1((d) => y(d[1]));

svg
  .selectAll("path")
  .data(layers)
  .enter()
  .append("path")
  .attr("d", area)
  .attr("fill", (d, i) => (i === 0 ? "lightblue" : "red"));

function stackMax(layer) {
  return d3.max(layer, (d) => d[1]);
}

function stackMin(layer) {
  return d3.min(layer, (d) => d[0]);
}

var isStop = false;
function stop() {
  isStop = true;
}
function start() {
  isStop = false;
  transition();
}

var delay = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));

async function transition() {
  var t;
  const _layers = stack(
    d3.transpose(randomData())
  );
  y.domain([
    d3.min(_layers, (l) => d3.min(l, (d) => d[0])),
    d3.max(_layers, (l) => d3.max(l, (d) => d[1]))
  ]);
  d3.selectAll("path").data(_layers).transition().duration(250).attr("d", area);

  if (!isStop) {
    await delay(0.15);
    transition();
  }
}
