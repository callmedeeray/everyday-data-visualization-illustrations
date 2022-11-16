
import * as d3 from "d3";
const tbl = require('url:./weekdayrentalsbyhour.csv');

const width = 500,
  height = 600;

let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#svg')
  .attr('width', width)
  .attr('height', height)
  ;

d3.csv(tbl).then((data) => {
  const x = d3.scaleLinear()
    .domain([0, 1007000])
    .range([width / 4, width])
    ;

  const y = d3.scaleBand()
    .range([0, height])
    .domain(data.map(d => d.hour))
    .padding(0.1);

  const y2 = d3.scaleBand()
    .range([0, height])
    .domain(data.map(d => d3.format(',')(d.rentals)))
    .padding(0.1);

  viz.append('g')
    .call(d3.axisLeft(y))
    .selectAll('text')
    .attr('transform', 'translate(10,0)')
    ;

  viz.append('g')
    .call(d3.axisLeft(y2))
    .selectAll('text')
    .attr('transform', 'translate(50,0)')
    ;


  viz.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', x(0))
    .attr('y', d => y(d.hour))
    .attr('width', d => x(d.rentals) - x(0))
    .attr('height', y.bandwidth())
    .attr('fill', 'grey')

  viz.selectAll('.domain').remove();
  viz.selectAll('text')
    .style('font-family', 'calibri')
    .style('font-size', '16px')
    .style('font-weight', 'medium')
    .style('text-anchor', 'start')
    ;

  let img = document.getElementById('#svg'),
    filename = '2.4 Bar graph';

  saveSvg(img, filename + '.svg');



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
