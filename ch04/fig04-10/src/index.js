
import * as d3 from "d3";
const tbl = require('url:./gender.csv');

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

d3.csv(tbl).then((data) => {

  const subgroups = data.columns.slice(1);
  const groups = data.map(d => d.group);

  const x = d3.scaleLinear()
    .domain([0, 5])
    .range([width / 5, width * 0.9]);

  const y = d3.scaleBand()
    .domain(groups)
    .range([height / 5, height])
    .padding([0.2]);


  viz.append('g')
    .call(d3.axisLeft(y))
    .attr('transform', `translate(${width / 5},0)`);

  const ySubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, y.bandwidth()])
    .padding([0.05]);

  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(colors);

  let bars = viz.append('g')
    .selectAll('g')
    .data(data)
    .join('g')
    .attr('class', d => d.group.replace(' ', ''))
    .attr('transform', d => `translate(0,${y(d.group)})`)
    .selectAll('rect')
    .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
    .join('g')
    .attr('class', d => d.key.trimStart());

  bars
    .append('rect')
    .attr('class', 'rect')
    .attr('y', d => ySubgroup(d.key))
    .attr('x', d => x(0))
    .attr('width', d => x(d.value) - x(0))
    .attr('height', ySubgroup.bandwidth())
    .attr('fill', d => color(d.key))

  bars.append('text')
    .text(d => d.value == 0 ? '' : d.value + '%')
    .attr('y', d => ySubgroup(d.key) + 4 + (0.5 * ySubgroup.bandwidth()))
    .attr('x', d => x(d.value) + 4)
    .attr('text-anchor', 'start')
    .attr('font-family', 'sans-serif')
    ;

  viz.selectAll('.domain').remove();
  viz.selectAll('.tick').select('line').remove();

  viz.selectAll('text')
    .attr('font-size', '12px')
    .attr('font-family', 'sans-serif');

  viz.select('.tritandeficiency')
    .select('.male')
    .attr('transform', `translate(0,${0.5 * ySubgroup.bandwidth()})`)
    .select('rect')
    .attr('fill', colors[2]);

  viz.select('.tritandeficiency')
    .select('.female')
    .remove();


  const lineHeight = 34;

  viz.append('text')
    .text('Prevalence of color vision deficiencies')
    .attr('x', 0)
    .attr('y', lineHeight + margin.top)
    .attr('text-anchor', 'start')
    .attr('font-family', 'sans-serif')
    .attr('font-size', `${0.8 * lineHeight}`)
    ;

  let subtitle = viz.append('text')
    .attr('x', 0)
    .attr('y', margin.top + 2 * lineHeight)
    .attr('font-size', `${0.6 * lineHeight}`)
    .attr('font-family', 'sans-serif')
    .attr('text-anchor', 'start')
    .attr('display', 'inline');

  subtitle.append('tspan')
    .text('among ')
    .attr('fill', 'black');

  subtitle.append('tspan')
    .text('males')
    .attr('fill', colors[0])
    .attr('font-weight', 'bold');

  subtitle.append('tspan')
    .text(' and ')
    .attr('fill', 'black');

  subtitle.append('tspan')
    .text('females')
    .attr('fill', colors[1])
    .attr('font-weight', 'bold');

  subtitle.append('tspan')
    .text(' (or ')
    .attr('fill', 'black');

  subtitle.append('tspan')
    .text('overall')
    .attr('fill', colors[2])
    .attr('font-weight', 'bold');

  subtitle.append('tspan')
    .text(').')
    .attr('fill', 'black');



  // let img = document.getElementById('#svg'),
  //   filename = 'colorblindness prevalence';
  // saveSvg(img, filename + '.svg');

});


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
