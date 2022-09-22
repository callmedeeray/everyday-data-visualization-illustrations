
import * as d3 from "d3";
const tbl = require('url:./fig01-d3-example.csv');

const width = 500,
  height = 300;

let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#svg')
  .attr('width', width)
  .attr('height', height)
  ;

d3.csv(tbl).then((data) => {
  const x = d3.scaleLinear()
    .domain([50,100])
    .range([width/3, 2*width/3])
    ;

  const y = d3.scaleBand()
    .range([0,height])
    .domain(data.map(d => d.Fruit))
    .padding(0.1);

  viz.append('g')
    .call(d3.axisLeft(y))
    .selectAll('text')
    .attr('transform', 'translate(10,0)')
    ;


  viz.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', x(0))
    .attr('y', d => y(d.Fruit))
    .attr('width', d => x(d.Taste_score))
    .attr('height', y.bandwidth())
    .attr('transform', `translate(${width/3},0)`)
    // .attr('fill', 'grey')

  viz.selectAll('.domain').remove();
  viz.selectAll('text')
    .style('font-family','calibri')
    .style('font-size','16px')
    .style('font-weight', 'medium')
    .style('text-anchor','start')
  ;

  let img = document.getElementById('#svg'),
    filename = 'd3 example';
    
  saveSvg(img, filename + '.svg');



})

function saveSvg(svgEl, name) {
  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  var svgData = svgEl.outerHTML;
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
