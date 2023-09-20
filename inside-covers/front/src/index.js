
import * as d3 from "d3";
// const tbl = require('url:./weekdayWordsbyIndex.csv');
const tbl = require('url:./wordcounts.csv');

// Leaned heavily on v6 code from https://d3-graph-gallery.com/graph/circular_barplot_label.html
// Thank you!

const
  margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 700 - margin.right - margin.left,
  height = 700 - margin.top - margin.bottom,
  innerRadius = 200,
  outerRadius = Math.min(width, height * 0.95) / 2,
  ringPadding = 5,
  ringThickness = 3,
  chapterOuter = innerRadius - ringPadding,
  chapterInner = chapterOuter - ringThickness,
  partOuter = chapterInner - ringPadding,
  partInner = partOuter - ringThickness
  ;

let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)
  ;



d3.csv(tbl).then((data) => {
  const x = d3.scaleBand()
    .domain(data.map(d => d.Index))
    .range([0, 2 * Math.PI])
    ;

  const y = d3.scaleRadial()
    .range([innerRadius, outerRadius])
    .domain([0, d3.max(data.map(d => d.Words))])
    ;

  let chapters = countArr(data, 'PartChapter', 'Index');
  console.log(chapters)

  // const chapterx = d3.scaleBand()
  //   .domain(chapters.map(d => d.PartChapter))
  //   .range([0, 2 * Math.PI])
  //   ;


  const partx = d3.scaleBand()
    .domain(data.map(d => d['PartNumber']))
    .range([0, 2 * Math.PI])
    ;



  viz.append('g')
    .selectAll('path')
    .data(data)
    .join('path')
    .attr('fill', '#4EC5D3')
    .attr('d', d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(d => y(d.Words))
      .startAngle(d => x(d.Index))
      .endAngle(d => x(d.Index) + x.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius * 2)
      .cornerRadius(innerRadius)
    )
    ;
  /*
    viz.append('g')
      .selectAll('path')
      .data(data)
      .join('path')
      .attr('fill', '#4EC5D3')
      .attr('d', d3.arc()
        .innerRadius(chapterInner)
        .outerRadius(chapterOuter)
        .startAngle(d => chapterx(d['ChapterNumber']))
        .endAngle(d => chapterx(d['ChapterNumber']) + chapterx.bandwidth())
        .padAngle(0.01)
        .padRadius(chapterInner * 2)
        .cornerRadius(ringThickness / 2)
      )
      ;
  
  viz.append('g')
    .selectAll('path')
    .data(data)
    .join('path')
    .attr('fill', '#4EC5D3')
    .attr('d', d3.arc()
      .innerRadius(partInner)
      .outerRadius(partOuter)
      .startAngle(d => partx(d['Part number']))
      .endAngle(d => partx(d['Part number']) + partx.bandwidth())
      .padAngle(0.01)
      .padRadius(partInner * 2)
      .cornerRadius(ringThickness / 2)
    )
    ;
    */
  /*
    viz.append('g')
      .selectAll('g')
      .data(data)
      .join('g')
      .attr('text-anchor', d => (x(d.Index) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start")
      .attr('transform', d => 'rotate(' + ((x(d.Index) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(0) - 18) + ",0)")
      .append('text')
      .text(d => d.Index)
      .attr('transform', d => (x(d.Index) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)")
      .style('font-size', '11px')
      .attr('alignment-baseline', 'middle')
   
  */
  let img = document.getElementById('#svg'),
    filename = 'InsideCover';
  // saveSvg(img, filename + '.svg');



})


const countArr = (arr, on, what) => {

  // using reduce() method to count 
  const agg = arr.reduce((output, current) => {

    // get the value of both the keys 
    const onValue = current[on];
    const whatValue = current[what];

    // if there is already a key present
    // merge its value
    if (output[onValue]) {
      output[onValue] = {
        [on]: onValue,
        [what]: [...output[onValue][what], whatValue]
      }
    }
    // create a new entry on the key
    else {
      output[onValue] = {
        [on]: onValue,
        [what]: [whatValue]
      }
    }
    // return the aggregation
    return Object.values(output);
  }, {});

  // console.log(agg.length)
  let counts = [];
  agg.forEach(d => {
    counts.push({ [on]: d[on], 'Length': d[what].length })
  });
  // return only values after aggregation 
  return counts //Object.values(agg);

}

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
