
const mapboxgl = require('mapbox-gl');
const turf = require('@turf/turf');
const tbl = require('url:./birthdaycommuterentals.csv');
const d3 = require('d3');


mapboxgl.accessToken = 'pk.eyJ1IjoiY2FsbG1lZGVlcmF5IiwiYSI6ImNqbDhrejUzdDNqejIzcGw3cTlhZ2JjbmgifQ.Gu7-_4OI-WsEM0D4FcR6PQ';

const zoom = 10.8, center = [-0.123179, 51.501543];

let map = new mapboxgl.Map({
  container: 'animation',
  style: 'mapbox://styles/callmedeeray/cl9bvp2y2000g14pdz2yere9q',
  zoom: zoom,
  center: center
})

// Number of steps to use in the arc and animation, more steps means
// a smoother arc and animation, but too many steps will result in a
// low frame rate
const steps = 50;
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
  console.log('style loaded');
  d3.csv(tbl).then((data) => {
    console.log('csv loaded');
    console.log('starting data loop')
    data.forEach((d, j) => {

      let startpoint = [d.StartStationLon, d.StartStationLat],
        endpoint = [d.EndStationLon, d.EndStationLat],
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
    console.log('finished data loop')
    // console.log(routes)
    // console.log(points)

    map.on('load', () => {
      console.log('map loaded');

      // map.addSource('routes', {
      //   'type': 'geojson',
      //   'data': routes
      // });

      map.addSource('points', {
        'type': 'geojson',
        'data': points
      });

      // map.addLayer({
      //   'id': 'routes',
      //   'source': 'routes',
      //   'type': 'line',
      //   'paint': {
      //     'line-width': 2,
      //     'line-color': '#007cbf'
      //   }
      // });

      map.addLayer({
        'id': 'points',
        'source': 'points',
        'type': 'circle',
        'paint': {
          'circle-radius': 5,
          'circle-color': '#F84C4C' // red color
        }
      });

      if (counter < steps) {
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
          p.geometry.coordinates =
            p.geometry.coordinates[counter];

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
        counter += 1;
      }

    })


    // function animate(routes, points) {

    //   let start =
    //     routes.features.geometry.coordinates[
    //     counter >= steps ? counter - 1 : counter
    //     ];
    //   let end =
    //     routes.features.geometry.coordinates[
    //     counter >= steps ? counter : counter + 1
    //     ];
    //   if (!start || !end) return;

    //   // Update point geometry to a new position based on counter denoting
    //   // the index to access the arc
    //   points.features[0].geometry.coordinates =
    //     routes.features[0].geometry.coordinates[counter];

    //   // Calculate the bearing to ensure the icon is rotated to match the route arc
    //   // The bearing is calculated between the current point and the next point, except
    //   // at the end of the arc, which uses the previous point and the current point
    //   points.features[0].properties.bearing = turf.bearing(
    //     turf.point(start),
    //     turf.point(end)
    //   );

    //   // Update the source with this new data
    //   map.getSource('points').setData(points);

    //   // Request the next frame of animation as long as the end has not been reached
    //   if (counter < steps) {
    //     requestAnimationFrame(animate);
    //   }

    //   counter += 1;

    // }
    // // Start the animation
    // routes.feautures.forEach((d,i) => {
    //   animate()
    // })
    // animate(counter, point);
  })
})