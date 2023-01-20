
import * as d3 from "d3";

const
  width = 550,
  height = 100
  ;

const imgName = 'chromaGradient';
const data = Array.from(Array(100).keys());

let colorScale1 = d3.scaleSequential()
  .interpolator(d3.interpolate(d3.hcl(0, 0, 50), d3.hcl(0, 230, 50))) // chroma
  .domain([0, 99])
  ;

let xScale = d3.scaleLinear()
  .domain([0, 99])
  .range([0, width]);

let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#' + imgName)
  .attr('width', width)
  .attr('height', height)

let first = viz.append('g');
first.selectAll('rect')
  .data(data)
  .join('rect')
  .attr('height', height)
  .attr('y', 0)
  .attr('x', d => Math.floor(xScale(d)))
  .attr('width', (d) => {
    if (d == 99) {
      return 6;
    }
    return Math.floor(xScale(d + 1)) - Math.floor(xScale(d)) + 1;
  })
  .attr('fill', d => colorScale1(d));


let image = document.getElementById('#' + imgName);
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
