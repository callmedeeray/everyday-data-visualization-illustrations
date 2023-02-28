
import * as d3 from "d3";
const tbl = require('url:./fruits.csv');

const imgName = 'CH05_F16_Abbott-One-font';


const
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  width = 550 + margin.right + margin.left,
  height = 300 + margin.top + margin.bottom,
  lineHeight = 32,
  titleSize = 16;


let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#' + imgName)
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)
  ;

viz.append('defs')
  .append('style')
  .attr('type', 'text/css')
  .text("@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&family=Roboto+Serif:opsz,wght@8..144,100;8..144,200;8..144,300;8..144,400;8..144,500;8..144,600;8..144,700;8..144,800;8..144,900&family=Roboto:wght@100;300;400;500;700;900&display=swap')")
  ;

d3.csv(tbl).then((data) => {
  const x = d3.scaleLinear()
    .domain([0, 100])
    .range([170, width - margin.left - margin.right - 30])
    ;

  const y = d3.scaleBand()
    .domain(data.map(d => d.Fruit))
    .range([(1.5 * titleSize) + margin.top, height - margin.bottom - margin.top])
    .padding(0.25);

  viz.append('g')
    .call(d3.axisLeft(y))
    .attr('transform', 'translate(10,0)') // I cannot figure out why I need this line but whatever.
    .selectAll('text')
    .style('font-family', 'Roboto, sans-serif')
    .style('font-size', '16px')
    .style('text-anchor', 'start')
    ;

  viz.append('g')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', x(0))
    .attr('y', d => y(d.Fruit))
    .attr('width', d => x(d.Taste_score) - x(0))
    .attr('height', y.bandwidth())
    .attr('fill', '#633091')
    ;

  viz.append('g')
    .selectAll('.label')
    .data(data)
    .join('text')
    .text(d => d.Taste_score)
    .attr('x', d => x(d.Taste_score) + 4)
    .attr('y', d => y(d.Fruit) + 0.5 * y.bandwidth() + 5)
    .style('font-family', 'Roboto, sans-serif')
    .style('font-size', '16px')
    .style('text-anchor', 'start')
    ;

  viz.selectAll('.domain').remove();
  viz.selectAll('.tick').select('line').remove();

  viz.append('text')
    .text('Taste Scores of Fruits')
    .attr('x', 0)
    .attr('y', 0)
    .attr('dominant-baseline', 'hanging')
    .style('font-family', 'Roboto, sans-serif')
    .style('font-size', `${titleSize}px`)
    ;

  let image = document.getElementById('#' + imgName);
  saveSvg(image, imgName.replace(/-/g, ' ') + '.svg');



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
