
import * as d3 from "d3";
const tbl = require('url:./weekdayrentalsbyhour.csv');

// Leaned heavily on v6 code from https://d3-graph-gallery.com/graph/circular_barplot_label.html
// Thank you!

const
  margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 500 - margin.right - margin.left,
  height = 500 - margin.top - margin.bottom,
  innerRadius = 80,
  outerRadius = Math.min(width, height) / 2
  ;

let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)
  ;

const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://sheets.googleapis.com/v4/spreadsheets/1IauBoJX2ETw3tgtlrxDIEzHmesFbPs4jX_TIyABAEKw/values/Sheet1!A1:L195');
xhr.send();
xhr.responseType = 'json';
xhr.onload = () => {
  if (xhr.readyState == 4 && xhr.status == 200) {
    let data = xhr.response;
    console.log(data);
  } else {
    console.log(`Error: ${xhr.status}`);
  }
}



d3.csv(tbl).then((data) => {
  const x = d3.scaleBand()
    .domain(data.map(d => d.hour))
    .align(0) // allegedly this does nothing?
    .range([0, 2 * Math.PI])
    ;

  const y = d3.scaleRadial()
    .range([innerRadius, outerRadius])
    .domain([0, d3.max(data.map(d => d.rentals))])
    ;


  viz.append('g')
    .selectAll('path')
    .data(data)
    .join('path')
    .attr('fill', 'grey')
    .attr('d', d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(d => y(d.rentals))
      .startAngle(d => x(d.hour))
      .endAngle(d => x(d.hour) + x.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius)
    )
    ;

  viz.append('g')
    .selectAll('g')
    .data(data)
    .join('g')
    .attr('text-anchor', d => (x(d.hour) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start")
    .attr('transform', d => 'rotate(' + ((x(d.hour) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(0) - 18) + ",0)")
    .append('text')
    .text(d => d.hour)
    .attr('transform', d => (x(d.hour) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)")
    .style('font-size', '11px')
    .attr('alignment-baseline', 'middle')


  let img = document.getElementById('#svg'),
    filename = '2.11 Radial graph';
  // saveSvg(img, filename + '.svg');



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
