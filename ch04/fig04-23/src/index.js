
import * as d3 from "d3";

const
  width = 700,
  height = 300
  ;


const imgName = 'single-vs-two-hue';
let data = [];
for (let i = 1; i <= 100; i++) {
  data.push({ 'x': 10 + (width / 3 - 20) * Math.random(), 'y': 10 + (height - 20) * Math.random(), 'i': i })
}




let colorScale1 = d3.scaleSequential()
  .interpolator(d3.interpolate(d3.color('hsl(270,0%,50%)'), 'hsl(270,100%,50%)'))
  .domain([0, 99])
  ;


let colorScale2 = d3.scaleSequential()
  .interpolator(d3.interpolateHsl(d3.color('hsl(180,10%,70%)'), 'hsl(270,100%,50%)'))
  .domain([1, 100])
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
