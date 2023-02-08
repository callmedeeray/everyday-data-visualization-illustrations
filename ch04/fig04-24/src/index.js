
import * as d3 from "d3";

const
  width = 700,
  height = 600,
  lineHeight = 24
  ;


const imgName = 'color-spaces',
  N = 60;
let data = [];
for (let i = 1; i <= N; i++) {
  data.push({ 'x': 10 + (width / 3 - 20) * Math.random(), 'y': 10 + (height / 3 - 20) * Math.random(), 'i': i })
}

let color1 = '#E70101',// '#00ffff',
  color2 = '#02D6D6';// '#633091';


let colorScale1 = d3.scaleSequential()
  .interpolator(d3.interpolateRgb(color1, color2))
  .domain([1, N])
  ;
let colorScale2 = d3.scaleSequential()
  .interpolator(d3.interpolateHsl(color1, color2))
  .domain([1, N])
  ;
let colorScale3 = d3.scaleSequential()
  .interpolator(d3.interpolateCubehelix(color1, color2))
  .domain([1, N])
  ;
let colorScale4 = d3.scaleSequential()
  .interpolator(d3.interpolateHcl(color1, color2))
  .domain([1, N])
  ;


let xScale = d3.scaleLinear()
  .domain([1, N])
  .range([0, (width / 3) - 20]);

let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#' + imgName)
  .attr('width', width)
  .attr('height', height)

let first = viz.append('g');
first.append('text')
  .text('RGB')
  .attr('x', 10)
  .attr('y', lineHeight)
  .attr('fill', 'black')
  .attr('text-anchor', 'start')
  .attr('font-family', 'sans-serif')
  .attr('font-size', `${0.8 * lineHeight}`)
  ;

first.selectAll('circle')
  .data(data)
  .join('circle')
  .attr('r', 10)
  .attr('cy', d => 0.8 * d.y)
  .attr('cx', d => d.x)
  .attr('fill', d => colorScale1(d.i))
  .attr('stroke', 'none')
  .attr('transform', `translate(0,${1.4 * lineHeight})`);

first.selectAll('rect')
  .data(data)
  .join('rect')
  .attr('x', d => 10 + Math.floor(xScale(d.i)))
  .attr('y', 0.3 * height)
  .attr('width', (d) => {
    if (d.i == N) {
      return 6;
    }
    return Math.floor(xScale(d.i + 1)) - Math.floor(xScale(d.i)) + 1;
  })
  .attr('height', 0.05 * height)
  .attr('fill', d => colorScale1(d.i))
  .attr('transform', `translate(0,${lineHeight})`);

let second = viz.append('g');
second.append('text')
  .text('HSL')
  .attr('x', 310)
  .attr('y', lineHeight)
  .attr('fill', 'black')
  .attr('text-anchor', 'start')
  .attr('font-family', 'sans-serif')
  .attr('font-size', `${0.8 * lineHeight}`)
  ;
second.selectAll('circle')
  .data(data)
  .join('circle')
  .attr('r', 10)
  .attr('cy', d => 0.8 * d.y)
  .attr('cx', d => 310 + d.x)
  .attr('fill', d => colorScale2(d.i))
  .attr('stroke', 'none')
  .attr('transform', `translate(0,${1.4 * lineHeight})`);

second.selectAll('rect')
  .data(data)
  .join('rect')
  .attr('x', d => 310 + Math.floor(xScale(d.i)))
  .attr('y', 0.3 * height)
  .attr('width', (d) => {
    if (d.i == N) {
      return 6;
    }
    return Math.floor(xScale(d.i + 1)) - Math.floor(xScale(d.i)) + 1;
  })
  .attr('height', 0.05 * height)
  .attr('fill', d => colorScale2(d.i))
  .attr('transform', `translate(0,${lineHeight})`);

let third = viz.append('g');
third.append('text')
  .text('CubeHelix')
  .attr('x', 10)
  .attr('y', 285 + lineHeight)
  .attr('fill', 'black')
  .attr('text-anchor', 'start')
  .attr('font-family', 'sans-serif')
  .attr('font-size', `${0.8 * lineHeight}`)
  ;
third.selectAll('circle')
  .data(data)
  .join('circle')
  .attr('r', 10)
  .attr('cy', d => (0.8 * d.y) + 300)
  .attr('cx', d => d.x)
  .attr('fill', d => colorScale3(d.i))
  .attr('stroke', 'none')
  .attr('transform', `translate(0,${1.4 * lineHeight})`);

third.selectAll('rect')
  .data(data)
  .join('rect')
  .attr('x', d => 10 + Math.floor(xScale(d.i)))
  .attr('y', 0.8 * height)
  .attr('width', (d) => {
    if (d.i == N) {
      return 6;
    }
    return Math.floor(xScale(d.i + 1)) - Math.floor(xScale(d.i)) + 1;
  })
  .attr('height', 0.05 * height)
  .attr('fill', d => colorScale3(d.i))
  .attr('transform', `translate(0,${lineHeight})`);



let fourth = viz.append('g');
first.append('text')
  .text('HCL (but not Munsell)')
  .attr('x', 310)
  .attr('y', 285 + lineHeight)
  .attr('fill', 'black')
  .attr('text-anchor', 'start')
  .attr('font-family', 'sans-serif')
  .attr('font-size', `${0.8 * lineHeight}`)
  ;
fourth.selectAll('circle')
  .data(data)
  .join('circle')
  .attr('r', 10)
  .attr('cy', d => (0.8 * d.y) + 300)
  .attr('cx', d => 310 + d.x)
  .attr('fill', d => colorScale4(d.i))
  .attr('stroke', 'none')
  .attr('transform', `translate(0,${lineHeight})`);

fourth.selectAll('rect')
  .data(data)
  .join('rect')
  .attr('x', d => 310 + Math.floor(xScale(d.i)))
  .attr('y', 0.8 * height)
  .attr('width', (d) => {
    if (d.i == N) {
      return 6;
    }
    return Math.floor(xScale(d.i + 1)) - Math.floor(xScale(d.i)) + 1;
  })
  .attr('height', 0.05 * height)
  .attr('fill', d => colorScale4(d.i))
  .attr('transform', `translate(0,${lineHeight})`);


// let image = document.getElementById('#' + imgName);
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
