
import * as d3 from "d3";

const
  width = 700,
  height = 300
  ;

const arange = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

const imgName = 'continuous-vs-stepped';
let data = [];
for (let i = 1; i <= 100; i++) {
  data.push({ 'x': 10 + (width / 3 - 20) * Math.random(), 'y': 10 + (height - 20) * Math.random(), 'i': i })
}

let grey = '#d9d9d9',
  color2 = d3.color('hsl(210,100%,44%)'),
  color1 = d3.color('hsl(0,100%,46%)');


let colorScale1 = d3.scaleDiverging()
  .domain([0, 50, 99])
  .range([color1, grey, color2])

let fiveColors = [];
arange(0, 100, 25).forEach((d) => { fiveColors.push(colorScale1(d)) })

let colorScale2 = d3.scaleThreshold()
  .domain([20, 40, 60, 80])
  .range(fiveColors)
  ;


let xScale = d3.scaleLinear()
  .domain([1, 100])
  .range([0, (width / 3) - 20]);

let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#' + imgName)
  .attr('width', width)
  .attr('height', height)

let first = viz.append('g');

first.selectAll('circle')
  .data(data)
  .join('circle')
  .attr('r', 10)
  .attr('cy', d => 0.8 * d.y)
  .attr('cx', d => d.x)
  .attr('fill', d => colorScale1(d.i))
  .attr('stroke', 'none');

first.selectAll('rect')
  .data(data)
  .join('rect')
  .attr('x', d => 10 + Math.floor(xScale(d.i)))
  .attr('y', 0.9 * height)
  .attr('width', (d) => {
    if (d.i == 100) {
      return 6;
    }
    return Math.floor(xScale(d.i + 1)) - Math.floor(xScale(d.i)) + 1;
  })
  .attr('height', 0.1 * height)
  .attr('fill', d => colorScale1(d.i));

let second = viz.append('g');
second.selectAll('circle')
  .data(data)
  .join('circle')
  .attr('r', 10)
  .attr('cy', d => 0.8 * d.y)
  .attr('cx', d => 310 + d.x)
  .attr('fill', d => colorScale2(d.i))
  .attr('stroke', 'none');


second.selectAll('rect')
  .data(data)
  .join('rect')
  .attr('x', d => 310 + Math.floor(xScale(d.i)))
  .attr('y', 0.9 * height)
  .attr('width', (d) => {
    if (d.i == 100) {
      return 6;
    }
    return Math.floor(xScale(d.i + 1)) - Math.floor(xScale(d.i)) + 1;
  })
  .attr('height', 0.1 * height)
  .attr('fill', d => colorScale2(d.i));




// let image = document.getElementById('#' + imgName);
// saveSvg(image, imgName + '.svg');




function saveSvg(svgEl, name) {
  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  var svgData = svgEl.outerHTML;
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  var svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
