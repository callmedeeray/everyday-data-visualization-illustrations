
import * as d3 from "d3";
const tbl = require('url:./TFLCycleHire2017-Table.csv')

var table = d3.select('#vizcontainer').append('table');
var thead = table.append('thead');
var tbody = table.append('tbody');

var columns = ['hour','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

thead.append('tr')
  .selectAll('th')
    .data(columns)
    .enter()
  .append('th')
    .text(function (d) { return d })

d3.csv(tbl).then( function (data) {
  console.log(data);
    tabulate(data,columns)

})



var tabulate = function (data,columns) {
  
  var rows = tbody.selectAll('tr')
      .data(data)
      .enter()
    .append('tr')

  var cells = rows.selectAll('td')
      .data(function(row) {
          return columns.map(function (column) {
              return { column: column, value: row[column] }
        })
    })
    .enter()
  .append('td')
    .text(function (d) { return d.value })

  return table;
}