
import * as d3 from "d3";
import { map } from "d3";
const tbl = require('url:./commutebikerentals.csv');

const width = 900,
  height = 600;

// 	    long	    lat	      eveningendpct	eveningstartpct	morningendpct	morningstartpct
// min	-0.236769	51.454752	1.67477E-05	  2.68392E-05	    1.03063E-05	  2.57656E-06
// max	-0.002275	51.549369	0.013555513	  0.004013856	    0.007021134	  0.013466622



let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#svg')
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', '0 51.454 0.255 0.1')
  ;

d3.csv(tbl).then((data) => {

  viz
    .append('g')
    .attr('transform', 'translate(0.25,0)')
    .selectAll('bubbles')
    .data(data)
    .join('circle')
    .attr('cx', d => d.longitude)
    .attr('cy', d => d.latitude)
    .attr('r', d => d.eveningendpct)
    .style('fill', 'red')
    // .attr('stroke', 'red')
    // .attr('stroke-width', 0.011)
    .attr('fill-opacity', 0.5)


  // let img = document.getElementById('#svg'),
  //   filename = '2.5 Bubbles';
    
  // saveSvg(img, filename + '.svg');



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
