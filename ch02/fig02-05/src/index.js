

// const { symbolAsterisk } = require('d3');

const { map } = require('d3');
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
mapboxgl.accessToken = 'pk.eyJ1IjoiY2FsbG1lZGVlcmF5IiwiYSI6ImNqbDhrejUzdDNqejIzcGw3cTlhZ2JjbmgifQ.Gu7-_4OI-WsEM0D4FcR6PQ';

const zoom = 10.8, center = [-0.123179, 51.501543];
let styles = [
  {
    container: 'morningstart',
    style: 'mapbox://styles/callmedeeray/cl97tig04000614q4q5z3l75q',
    zoom: zoom,
    center: center
  },
  {
    container: 'morningend',
    style: 'mapbox://styles/callmedeeray/cl97u12fd004015qko0nvxecf',
    zoom: zoom,
    center: center
  },
  {
    container: 'eveningstart',
    style: 'mapbox://styles/callmedeeray/cl97u2w6a000315qpwzxygzzq',
    zoom: zoom,
    center: center
  },
  {
    container: 'eveningend',
    style: 'mapbox://styles/callmedeeray/cl97u2c7w000514rwhtoeh1wo',
    zoom: zoom,
    center: center
  }
];

styles.forEach(d => {
  new mapboxgl.Map(d)
})

