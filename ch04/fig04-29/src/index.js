
import * as d3 from "d3";
const data = [93, 75, 69, 43],
  filename = 'accidental-emphasis';

const
  width = 750,
  height = 250,
  colors = [d3.color('hsl(330,98%,42%)'), d3.color('hsl(60,98%,42%)'), d3.color('hsl(150,98%,72%)'), d3.color('hsl(240,98%,42%)')],
  colors2 = [d3.color('hsl(330,98%,42%)'), d3.color('hsl(60,98%,42%)'), d3.color('hsl(150,98%,42%)'), d3.color('hsl(240,98%,42%)')]
  ;

let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  ;

const x = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 0.45 * width]);

const y = d3.scaleBand()
  .domain([0, 1, 2, 3])
  .range([0, height])
  .padding([0.1]);

let bars1 = viz.append('g');
bars1.selectAll('rect')
  .data(data)
  .join('rect')
  .attr('y', (d, i) => y(i))
  .attr('x', x(0))
  .attr('width', d => x(d) - x(0))
  .attr('height', y.bandwidth())
  .attr('fill', (d, i) => colors[i]);

let bars2 = viz.append('g').attr('transform', `translate(${width * 0.55},0)`);
bars2.selectAll('rect')
  .data(data)
  .join('rect')
  .attr('y', (d, i) => y(i))
  .attr('x', x(0))
  .attr('width', d => x(d) - x(0))
  .attr('height', y.bandwidth())
  .attr('fill', (d, i) => colors2[i]);

viz.selectAll('.domain').remove();
viz.selectAll('.tick').select('line').remove();



// let img = document.getElementById('#svg');
// saveSvg(img, filename + '.svg');


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
