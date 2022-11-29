
import * as d3 from "d3";
const tbl = require('url:./gender.csv');


// source: Opsin genes, cone photopigments, color vision, and color blindness
// by Lindsay T Sharpe, Andrew Stockman, Herbert Jägle, and Jeremy Nathans
// as part of Color Perception: From Genes to Perception, 1999. Page 30

// const data = [
//   { 'protanomaly': { 'male': 1.08, 'female': 0.03 } },
//   { 'protanopia': { 'male': 1.01, 'female': 0.02 } },
//   { 'deutanomaly': { 'male': 4.63, 'female': 0.36 } },
//   { 'deutanopia': { 'male': 1.27, 'female': 0.01 } }
//   // { 'male': { 'protanomaly': 1.08, 'protanopia': 1.01, 'deutanomaly': 4.63, 'deutanopia': 1.27 } },
//   // { 'female': { 'protanomaly': 0.03, 'protanopia': 0.02, 'deutanomaly': 0.36, 'deutanopia': 0.01 } }
// ];
// data comes from a meta-analysis of 20th century studies of 45,989 males and 30,711 females
// Studies took place in Norway, Switzerland, Germany, Great Britain, France, The Netherlands, Greece, and Iran
// const data = [
//   { 'european': { 'male': 7.40, 'female': 0.50, 'male_total': 250281, 'female_total': 48080 } },
//   { 'asian': { 'male': 4.17, 'female': 0.58, 'male_total': 349185, 'female_total': 231208 } },
//   { 'african': { 'male': 2.61, 'female': 0.54, 'male_total': 3874, 'female_total': 1287 } },
//   { 'austrialian aboriginal': { 'male': 1.98, 'female': 0.03, 'male_total': 4455, 'female_total': 3201 } },
//   { 'native american': { 'male': 1.94, 'female': 0.63, 'male_total': 1548, 'female_total': 1420 } },
//   { 'south pacific islander': { 'male': 0.82, 'female': null, 'male_total': 608, 'female_total': null } }
// ];
// data comes from a meta-analysis of 67 20th century studies.


// const groups = ['protanomaly', 'protanopia', 'deutanomaly', 'deutanopia'];
// // const groups = ['european', 'asian', 'african', 'australian aboriginal', 'native american', 'south pacific islander'];
// const subgroups = ['male', 'female'];

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
  ;

d3.csv(tbl).then((data) => {

  const subgroups = data.columns.slice(1);
  const groups = data.map(d => d.group);

  const x = d3.scaleLinear()
    .domain([0, 5])
    .range([width / 5, width]);

  const y = d3.scaleBand()
    .domain(groups)
    .range([0, height])
    .padding([0.2]);

  viz.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  viz.append('g')
    .call(d3.axisLeft(y))
    .attr('transform', `translate(${width / 5},0)`);

  const ySubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, y.bandwidth()])
    .padding([0.05]);

  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#00C4AA', '#8601F8'])

  viz.append('g')
    .selectAll('g')
    .data(data)
    .join('g')
    .attr('transform', d => `translate(0,${y(d.group)})`)
    .selectAll('rect')
    .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
    .join('rect')
    .attr('y', d => ySubgroup(d.key))
    .attr('x', d => x(0))
    .attr('width', d => x(d.value) - x(0))
    .attr('height', ySubgroup.bandwidth())
    .attr('fill', d => color(d.key));



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
