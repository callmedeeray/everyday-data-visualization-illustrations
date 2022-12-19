
import * as d3 from "d3";

const
  margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 550 - margin.right - margin.left,
  height = 500 - margin.top - margin.bottom,
  colors = ['#00A791', '#6E01CC', '#949494'] // males, females, overall
  ;

let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#svg')
  .attr('width', width)
  .attr('height', height)
  .attr('transform', `translate(${margin.left},${margin.top})`)
  .append('g')
  ;


// let img = document.getElementById('#svg'),
//   filename = 'gradients';
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
