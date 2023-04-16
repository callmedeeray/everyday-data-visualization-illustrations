
import * as d3 from "d3";
const tbl = require('url:./clustered-bar-data.tsv');

const imgName = 'd3-clustered-bars';


const
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  width = 402 - margin.right - margin.left,
  height = 420 - margin.top - margin.bottom,
  titleSize = 0;


let svg = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#' + imgName)
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)
  ;

svg.append('defs')
  .append('style')
  .attr('type', 'text/css')
  .text("@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&family=Roboto+Serif:opsz,wght@8..144,100;8..144,200;8..144,300;8..144,400;8..144,500;8..144,600;8..144,700;8..144,800;8..144,900&family=Roboto:wght@100;300;400;500;700;900&display=swap')")
  ;

d3.tsv(tbl).then((data) => {

  // List of subgroups = header of the csv files = soil condition here
  let subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  let groups = d3.map(data, d => (d.group))

  // Add X axis
  let x = d3.scaleBand()
    .domain(groups)
    .range([margin.left, width + margin.left])
    .padding([0.2]);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  let y = d3.scaleLinear()
    .domain([0, 506000000])
    .range([height, 0]);

  svg.append("g")
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(10, "s"));

  // Another scale for subgroup position?
  let xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])


  // color palette = one color per subgroup
  let color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#60730B', '#A1A72B', '#DF9278', '#6A8C3C', '#767F8B'])


  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${x(d.group)},0)`)
    .selectAll("rect")
    .data(d => subgroups.map((key) => ({ key: key, value: d[key] })))
    .enter().append("rect")
    .attr("x", d => xSubgroup(d.key))
    .attr("y", d => y(d.value))
    .attr("width", xSubgroup.bandwidth())
    .attr("height", (d) => (height - y(d.value)))
    .attr("fill", d => color(d.key));

  /*

// const x = d3.scaleLinear()
//   .domain([0, 100])
//   .range([170, width - margin.left - margin.right - 30])
//   ;
 
// const y = d3.scaleBand()
//   .domain(data.map(d => d.Fruit))
//   .range([(1.5 * titleSize) + margin.top, height - margin.bottom - margin.top])
//   .padding(0.25);
 
// viz.append('g')
//   .call(d3.axisLeft(y))
//   .attr('transform', 'translate(10,0)') // I cannot figure out why I need this line but whatever.
//   .selectAll('text')
//   .style('font-family', 'Roboto, sans-serif')
//   .style('font-size', '16px')
//   .style('text-anchor', 'start')
//   ;
 
// viz.append('g')
//   .selectAll('rect')
//   .data(data)
//   .join('rect')
//   .attr('x', x(0))
//   .attr('y', d => y(d.Fruit))
//   .attr('width', d => x(d.Taste_score) - x(0))
//   .attr('height', y.bandwidth())
//   .attr('fill', '#633091')
//   ;
 
// viz.append('g')
//   .selectAll('.label')
//   .data(data)
//   .join('text')
//   .text(d => d.Taste_score)
//   .attr('x', d => x(d.Taste_score) + 4)
//   .attr('y', d => y(d.Fruit) + 0.5 * y.bandwidth() + 5)
//   .style('font-family', 'Roboto, sans-serif')
//   .style('font-size', '16px')
//   .style('text-anchor', 'start')
//   ;
 
// viz.selectAll('.domain').remove();
// viz.selectAll('.tick').select('line').remove();
 
// viz.append('text')
//   .text('Taste Scores of Fruits')
//   .attr('x', 0)
//   .attr('y', 0)
//   .attr('dominant-baseline', 'hanging')
//   .style('font-family', 'Roboto, sans-serif')
//   .style('font-size', `${titleSize}px`)
//   ;
 
 
 
 
 
// let image = document.getElementById('#' + imgName);
// saveSvg(image, imgName.replace(/-/g, ' ') + '.svg');
 
 
*/
})





function saveSvg(svgEl, name) {
  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  let svgData = svgEl.outerHTML;
  let preface = '<?xml version="1.0" standalone="no"?>\r\n';
  let svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
  let svgUrl = URL.createObjectURL(svgBlob);
  let downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
