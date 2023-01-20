
import * as d3 from "d3";
import { svg } from "d3";
const tbl = require('url:./random.csv');

const filename = 'heatmap',
  colors1 = ['#40BF40', '#E6E500', '#E50000'],
  colors2 = ['#1170aa', '#c8d0d9', '#fc7d0b'];

const
  width = 2077,
  height = (1380 * 2) + 100;

let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  ;


d3.csv(tbl).then((data) => {

  const x = d3.scaleBand()
    .domain([1, 2, 3, 4, 5])
    .range([0, width])
    .padding([0.02]);

  const y = d3.scaleBand()
    .domain([1, 2, 3, 4, 5])
    .range([0, 1380])
    .padding([0.02]);


  let color1 = d3.scaleDiverging()
    .domain([0, 50, 99])
    .range(colors1)
    ;
  let color2 = d3.scaleDiverging()
    .domain([0, 50, 99])
    .range(colors2)
    ;

  let map1 = viz.append('g');
  map1.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', d => x(+d.col))
    .attr('y', d => y(+d.row))
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .attr('fill', d => color1(+d.value))
    .attr('stroke-width', 1)
    .attr('stroke', 'none')
    .attr('value', d => d.value);


  let map2 = viz.append('g');
  map2.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', d => x(+d.col))
    .attr('y', d => 1480 + y(+d.row))
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .attr('fill', d => color2(+d.value))
    .attr('stroke-width', 1)
    .attr('stroke', 'none')
    .attr('value', d => d.value);





  viz.selectAll('.domain').remove();
  viz.selectAll('.tick').select('line').remove();

  let img = document.getElementById('#svg');
  // saveSvg(img, filename + '.svg'); // uncomment this to save the image

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
