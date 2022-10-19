
const mapboxgl = require('mapbox-gl');
const turf = require('@turf/turf');
const tbl = require('url:./one-day-morning-commute-rentals.csv');
const d3 = require('d3');

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FsbG1lZGVlcmF5IiwiYSI6ImNqbDhrejUzdDNqejIzcGw3cTlhZ2JjbmgifQ.Gu7-_4OI-WsEM0D4FcR6PQ';

const zoom = 12.2, center = [-0.123179, 51.501543];

let map = new mapboxgl.Map({
  container: 'animation',
  style: 'mapbox://styles/callmedeeray/cl9bvp2y2000g14pdz2yere9q',
  zoom: zoom,
  center: center
})

// Number of steps to use in the arc and animation, more steps means
// a smoother arc and animation, but too many steps will result in a
// low frame rate
const steps = 500;

let routes = {
  'type': 'FeatureCollection',
  'features': []
},
  points = {
    'type': 'FeatureCollection',
    'features': []
  };

// Used to increment the value of the point measurement against the route.
let counter = 0;

map.on('style.load', () => {

  d3.csv(tbl).then((data) => {

    data.forEach((d, j) => {

      let startpoint = [+d.StartStationLon, +d.StartStationLat],
        endpoint = [+d.EndStationLon, +d.EndStationLat],
        route_features = {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [startpoint, endpoint]
          }
        },
        point_features = {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'Point',
            'coordinates': startpoint
          }
        }

      // Calculate the distance in kilometers between route start/end point.
      const lineDistance = turf.length(route_features);
      const arc = [];
      // Draw an arc between the `origin` & `destination` of the two points
      for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turf.along(route_features, i);
        arc.push(segment.geometry.coordinates);
      }
      // Update the route with calculated arc coordinates
      route_features.geometry.coordinates = arc;

      routes.features.push(route_features);
      points.features.push(point_features);

    })

    map.on('load', () => {

      map.addSource('points', {
        'type': 'geojson',
        'data': points
      });

      map.addLayer({
        'id': 'points',
        'source': 'points',
        'type': 'circle',
        'paint': {
          'circle-radius': 4,
          'circle-color': '#F84C4C' // red color
        }
      });

      function animate() {

        points.features.forEach((p, i) => {
          let start =
            routes.features[i].geometry.coordinates[
            counter >= steps ? counter - 1 : counter
            ];
          let end =
            routes.features[i].geometry.coordinates[
            counter >= steps ? counter : counter + 1
            ];
          if (!start || !end) return;

          // Update point geometry to a new position based on counter denoting
          // the index to access the arc
          // console.log(routes)
          p.geometry.coordinates = routes.features[i].geometry.coordinates[counter];

          // Calculate the bearing to ensure the icon is rotated to match the route arc
          // The bearing is calculated between the current point and the next point, except
          // at the end of the arc, which uses the previous point and the current point
          p.properties.bearing = turf.bearing(
            turf.point(start),
            turf.point(end)
          );
          points.features[i] = p;
        })
        // Update the source with this new data
        map.getSource('points').setData(points);

        // Request the next frame of animation as long as the end has not been reached
        if (counter < steps) {
          requestAnimationFrame(animate);
        }
        counter += 1;
      }

      document.getElementById('replay').addEventListener('click', () => {
        // Set the coordinates of the original point back to origin
        points.features.forEach((p, i) => { points.features[0].geometry.coordinates = origin })

        // Update the source layer
        map.getSource('points').setData(points);

        // Reset the counter
        counter = 0;

        // Restart the animation
        animate(counter);
      });

      animate(counter);
    })
  })
})