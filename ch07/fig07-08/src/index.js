
import * as d3 from "d3";
const tbl = require('url:./weekdayrentalsbyhour.csv');

const imgName = 'CH07_F07_Abbott-Lines';


const
  width = 360,
  height = 840;


let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#' + imgName)
  .attr('width', width)
  .attr('height', height)
  ;

d3.csv(tbl).then((data) => {

  const x = d3.scaleLinear()
    .domain([0, 24])
    .range([0.02 * width, 0.98 * width]);

  const multiplier = 2;

  const y1 = d3.scaleLinear()
    .domain([0, multiplier * d3.max(data, d => d.value)])
    .range([0.99 * height, 0.81 * height]);
  const y2 = d3.scaleLinear()
    .domain([0, multiplier * d3.max(data, d => d.value)])
    .range([0.80 * height, 0.62 * height]);
  const y3 = d3.scaleLinear()
    .domain([0, multiplier * d3.max(data, d => d.value)])
    .range([0.61 * height, 0.43 * height]);
  const y4 = d3.scaleLinear()
    .domain([0, multiplier * d3.max(data, d => d.value)])
    .range([0.42 * height, 0.24 * height]);
  const y5 = d3.scaleLinear()
    .domain([0, multiplier * d3.max(data, d => d.value)])
    .range([0.23 * height, 0.5 * height]);

  viz.append('g')
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('d', d3.line()
      .x(d => x(d.hour))
      .y(d => y1(d.value * Math.random()))
    );

  viz.append('g')
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('d', d3.line()
      .x(d => x(d.hour))
      .y(d => y2(d.value * Math.random()))
    );

  viz.append('g')
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('d', d3.line()
      .x(d => x(d.hour))
      .y(d => y3(d.value * Math.random()))
    );

  viz.append('g')
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('d', d3.line()
      .x(d => x(d.hour))
      .y(d => y4(d.value * Math.random()))
    );

  viz.append('g')
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('d', d3.line()
      .x(d => x(d.hour))
      .y(d => y5(d.value * Math.random()))
    );








  // let image = document.getElementById('#' + imgName);
  // saveSvg(image, imgName.replace(/-/g, ' ') + '.svg');



})





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
