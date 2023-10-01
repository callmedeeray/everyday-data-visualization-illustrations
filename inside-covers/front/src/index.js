
import * as d3 from "d3";
import { textwrap } from 'd3-textwrap';
const tbl = require('url:./wordcounts.csv');

// Leaned heavily on v6 code from https://d3-graph-gallery.com/graph/circular_barplot_label.html
// Thank you!

const
  margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 700 - margin.right - margin.left,
  height = 700 - margin.top - margin.bottom,
  innerRadius = 200,
  outerRadius = Math.min(width, height * 0.95) / 2,
  ringPadding = 3,
  ringThickness = 30,
  chapterOuter = innerRadius - ringPadding,
  chapterInner = chapterOuter - ringThickness,
  chapterLabel = ((chapterOuter + chapterInner) / 2),
  partOuter = chapterInner - ringPadding,
  partInner = partOuter - ringThickness * 1.5,
  partLabel = ((partOuter + partInner) / 2),
  circleStart = 0,
  circleEnd = (2 * Math.PI) - circleStart
  ;

let viz = d3.select('#vizcontainer')
  .append('svg')
  .attr('id', '#svg')
  .attr('xmlns', 'http://www.w3.org/2000/svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)
  ;



d3.csv(tbl).then((data) => {

  let title = viz.append('text')

  title
    .append('tspan')
    .attr('x', 0)
    .attr('y', -60)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .text('A picture')
    .style('font-family', 'Euphoria Script')
    .style('font-size', '48px')
    // is worth a ')
    ;
  title.append('tspan')
    .attr('x', 0)
    .attr('y', -42)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('dy', 22)
    .text('is worth a')
    .style('font-family', 'Euphoria Script')
    .style('font-size', '48px')
    ;
  title.append('tspan')
    .attr('x', 0)
    .attr('y', -15)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-weight', '100')
    .attr('dy', 22)
    .text('(hundred)')
    ;

  title.append('tspan')
    .attr('x', 0)
    .attr('y', -5)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('dy', 40)
    .style('font-family', 'Euphoria Script')
    .style('font-size', '48px')
    .text('thousand')
    ;

  title.append('tspan')
    .attr('x', 0)
    .attr('y', 5)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('dy', 64)
    .style('font-family', 'Euphoria Script')
    .style('font-size', '48px')
    .text('words.')
    ;
  const x = d3.scaleBand()
    .domain(data.map(d => d.Index))
    .range([circleStart, circleEnd])
    ;

  const y = d3.scaleRadial()
    .range([innerRadius, outerRadius])
    .domain([0, d3.max(data.map(d => d.Words))])
    ;

  let [chapters, sections] = countArr(data, 'PartChapter', 'Index');

  const stackedPartchapter = d3.stack()
    .keys(Object.keys(chapters[0]))
    (chapters)
    ;

  let [parts, junk] = countArr(data, 'PartNumber', 'Index');
  const stackedPart = d3.stack()
    .keys(Object.keys(parts[0]))
    (parts)
    ;



  viz.append('g')
    .attr('id', 'wordCounts')
    .selectAll('path')
    .data(data)
    .join('path')
    .attr('fill', 'black')
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

  // Add a slim ring to place the text on
  viz.append('g')
    .attr('id', 'ChapterLabelBaseline')
    .selectAll('path')
    .data(stackedPartchapter)
    .join('path')
    .attr('id', d => d.key)
    .attr('fill', 'none')
    .attr('stroke', 'none')
    .attr('d', d3.arc()
      .innerRadius(chapterLabel)
      .outerRadius(chapterLabel)
      .startAngle(d => angles(d[0], sections)[0])
      .endAngle(d => angles(d[0], sections)[1])
      .padAngle(0.01)
      .padRadius(chapterInner * 2)
    )
    ;

  // Now add the chunky ring for the chapters
  viz.append('g')
    .attr('id', 'Chapters')
    .selectAll('path')
    .data(stackedPartchapter)
    .join('path')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('d', d3.arc()
      .innerRadius(chapterInner)
      .outerRadius(chapterOuter)
      .startAngle(d => angles(d[0], sections)[0])
      .endAngle(d => angles(d[0], sections)[1])
      .padAngle(0.01)
      .padRadius(chapterInner * 2)
      .cornerRadius(ringThickness / 8)
    )
    ;
  // Now add the text for the chapter labels
  viz.append('g')
    .attr('id', 'ChapterLabels')
    .selectAll('text')
    .data(stackedPartchapter)
    .join('text')
    .append('textPath')
    .attr('href', d => `#${d.key}`)
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-family', 'Roboto')
    .attr('alignment-baseline', 'middle')
    .attr('startOffset', (d) => {
      let offset = '25%'
      if (angles(d[0], sections)[0] > Math.PI / 2 && angles(d[0], sections)[0] < 5 * Math.PI / 4) {
        offset = '75%'
      }
      return offset
    })
    .text((d) => {
      let ch = d.key.split('.')[1];
      if (ch > 0) {
        return 'Chapter ' + ch.toString()
      }
    })
    ;
  // Add another slim ring for the part labels
  viz.append('g')
    .attr('id', 'PartLabelBaseline')
    .selectAll('path')
    .data(stackedPart)
    .join('path')
    .attr('fill', 'none')
    .attr('id', d => d.key)
    .attr('stroke', 'none')
    .attr('d', d3.arc()
      .innerRadius(partLabel)
      .outerRadius(partLabel)
      .startAngle(d => angles(d[0], sections)[0])
      .endAngle(d => angles(d[0], sections)[1])
      .padAngle(0.01)
      .padRadius(partInner * 2)
      .cornerRadius(ringThickness / 8)
    )
    ;


  // Now make the real rings for the parts
  viz.append('g')
    .attr('id', 'Parts')
    .selectAll('path')
    .data(stackedPart)
    .join('path')
    .attr('fill', 'none')
    .attr('id', d => 'Part ' + d.key)
    .attr('stroke', 'black')
    .attr('d', d3.arc()
      .innerRadius(partInner)
      .outerRadius(partOuter)
      .startAngle(d => angles(d[0], sections)[0])
      .endAngle(d => angles(d[0], sections)[1])
      .padAngle(0.01)
      .padRadius(partInner * 2)
      .cornerRadius(ringThickness / 8)
    )
    ;

  // Now add the text for the part labels
  viz.append('g')
    .attr('id', 'PartLabels')
    .selectAll('text')
    .data(stackedPart)
    .join('text')
    .append('textPath')
    .attr('href', d => `#${d.key}`)
    .style('text-anchor', 'middle')
    .style('font-size', '18px')
    .style('font-family', 'Roboto')
    .attr('alignment-baseline', 'middle')
    .attr('startOffset', (d) => {
      let offset = '25%'
      if (angles(d[0], sections)[0] > Math.PI / 2 && angles(d[0], sections)[0] < 5 * Math.PI / 4) {
        offset = '75%'
      }
      return offset
    })
    .text(d => `Part ${d.key}`)
    ;

  let img = document.getElementById('#svg'),
    filename = 'InsideCover';
  //saveSvg(img, filename + '.svg');



})



const countArr = (arr, on, what) => {
  let counts = {}, total = 0, things = {};
  arr.forEach(d => {
    if (things[d[on]]) {
      things[d[on]] += 1;
    }
    else {
      things[d[on]] = 1;
    }

  });
  Object.keys(things).forEach(d => {
    counts[d.toString()] = things[d];
    total += things[d];
  })

  return [[counts], total];
}

const angles = ([d0, d1], s) => {
  let start = circleStart + (circleEnd - circleStart) * d0 / s,
    end = circleStart + (circleEnd - circleStart) * d1 / s;

  return [start, end]
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
