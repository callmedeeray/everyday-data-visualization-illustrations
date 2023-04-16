
import * as d3 from "d3";
const tbl = require('url:./clustered-bar-data.tsv');

const imgName = 'd3-clustered-bars';


const
  margin = { top: 0, right: 35, bottom: 20, left: 50 },
  width = 402 - margin.right - margin.left,
  height = 420 - margin.top - margin.bottom,
  titleSize = 0;


let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#' + imgName)
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)
  ;

viz.append('defs')
  .append('style')
  .attr('type', 'text/css')
  .text("@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&display=swap')")
  ;

d3.tsv(tbl).then((data) => {
  // Code adapted from https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html

  // List of subgroups = header of the csv files = soil condition here
  let subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  let groups = d3.map(data, d => (d.group))

  // Add y axis
  let y = d3.scaleBand()
    .domain(groups)
    .range([0, height])
    .padding([0.2]);

  viz.append("g")
    .attr('transform', `translate(${margin.left},0)`)
    .attr('font-family', 'Open Sans')
    .attr('font-weight', 300)
    .attr('class', 'axis')
    .call(d3.axisLeft(y).tickSize(0));


  // Add x axis
  let x = d3.scaleLinear()
    .domain([0, 555000000])
    .range([margin.left, width + margin.left]);

  viz.append("g")
    .attr("transform", `translate(0,${height})`)
    .attr('font-family', 'Open Sans')
    .attr('font-weight', 300)
    .attr('class', 'axis')
    .call(d3.axisBottom(x).ticks(6, "s").tickSizeInner(-height));

  // Another scale for subgroup position?
  let ySubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, y.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  let color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#60730B', '#A1A72B', '#DF9278', '#6A8C3C', '#767F8B'])


  // Show the bars
  viz.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .join("g")
    .attr("transform", d => `translate(0,${y(d.group)})`)
    .selectAll("rect")
    .data(d => subgroups.map((key) => ({ key: key, value: d[key] })))
    .join("rect")
    .attr("y", d => ySubgroup(d.key))
    .attr("x", d => x(0))
    .attr("height", ySubgroup.bandwidth())
    .attr("width", (d) => (x(d.value) - x(0)))
    .attr("fill", d => color(d.key));

  viz.selectAll('.domain').remove();
  viz.selectAll('text').attr('fill', '#0B1D43');
  viz.selectAll('.tick').select('line').attr('stroke', '#F5F5F5')
  viz.selectAll('.axis').attr('font-size', 12)

  // let image = document.getElementById('#' + imgName);
  // saveSvg(image, imgName.replace(/-/g, ' ') + '.svg');


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
