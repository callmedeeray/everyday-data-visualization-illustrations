
const mapboxgl = require('mapbox-gl');
const turf = require('@turf/turf');
const tbl = require('url:./mondaycommuterentals.csv');
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
const steps = 500;


map.on('style.load', () => {
  let everything = [];
  d3.csv(tbl).then((data) => {
    data.forEach((d) => {
      let startpoint = [d.StartStationLon, d.StartStationLat],
        endpoint = [d.EndStationLon, d.EndStationLat],
        route = {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'LineString',
                'coordinates': [startpoint, endpoint]
              }
            }
          ]
        },
        point = {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'Point',
                'coordinates': startpoint
              }
            }
          ]
        };
      // Calculate the distance in kilometers between route start/end point.
      const lineDistance = turf.length(route.features[0]);

      const arc = [];


      // Draw an arc between the `origin` & `destination` of the two points
      for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turf.along(route.features[0], i);
        arc.push(segment.geometry.coordinates);
      }

      // Update the route with calculated arc coordinates
      route.features[0].geometry.coordinates = arc;

      everything.push({ route: route, point: point });


    })
    // Used to increment the value of the point measurement against the route.
    let counter = 0;

    map.on('load', () => {
      // IT'S NOT GETTING HERE FOR SOME REASON
      console.log('hello!')
      everything.forEach((e, j) => {

        map.addSource('route' + j, {
          'type': 'geojson',
          'data': e.route
        });

        map.addSource('point' + j, {
          'type': 'geojson',
          'data': e.point
        });

        map.addLayer({
          'id': 'route' + j,
          'source': 'route' + j,
          'type': 'line',
          'paint': {
            'line-width': 2,
            'line-color': '#007cbf'
          }
        });

        map.addLayer({
          'id': 'point' + j,
          'source': 'point' + j,
          'type': 'circle',
          'paint': {
            'circle-radius': 2,
            'circle-color': '#F84C4C' // red color
          }
        });



        function animate() {
          everything.forEach((d) => {
            let route = d.route,
              point = d.point;


            let start =
              route.features[0].geometry.coordinates[
              counter >= steps ? counter - 1 : counter
              ];
            let end =
              route.features[0].geometry.coordinates[
              counter >= steps ? counter : counter + 1
              ];
            if (!start || !end) return;

            // Update point geometry to a new position based on counter denoting
            // the index to access the arc
            point.features[0].geometry.coordinates =
              route.features[0].geometry.coordinates[counter];

            // Calculate the bearing to ensure the icon is rotated to match the route arc
            // The bearing is calculated between the current point and the next point, except
            // at the end of the arc, which uses the previous point and the current point
            point.features[0].properties.bearing = turf.bearing(
              turf.point(start),
              turf.point(end)
            );

            // Update the source with this new data
            map.getSource('point' + j).setData(point);

            // Request the next frame of animation as long as the end has not been reached
            if (counter < steps) {
              requestAnimationFrame(animate);
            }

            counter = counter + 1;

          })
        }
        // Start the animation
        animate(counter);
      })

    });
  });
});