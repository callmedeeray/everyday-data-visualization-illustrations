
const mapboxgl = require('mapbox-gl');

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FsbG1lZGVlcmF5IiwiYSI6ImNqbDhrejUzdDNqejIzcGw3cTlhZ2JjbmgifQ.Gu7-_4OI-WsEM0D4FcR6PQ';

const zoom = 10.8, center = [-0.123179, 51.501543];

let map = new mapboxgl.Map({
    container: 'animation',
    style: 'mapbox://styles/callmedeeray/cl9bvp2y2000g14pdz2yere9q',
    zoom: zoom,
    center: center
  })

let data = [
// StartStation Lat, 0
// StartStation Lon, 1
// StartStaton Docks, 2
// EndStation Lat, 3
// EndStation Lon, 4
// EndStationDocks, 5
// Rental Id, 6 
// Duration, 7
// Bike Id, 8
// StartDate, 9
// StartStation Id, 10 
// StartStation Name, 11
// EndDate, 12
// EndStation Id, 13
// EndStation Name, 14
// Year 15
[51.490163,-0.190393,29,51.490945,-0.18119,30,63751445,180,3428,'2017-04-05 22:47:00,219',"Bramham Gardens, Earl's Court",'2017-04-05 22:50:00,216',"Old Brompton Road, South Kensington",2017],
[51.490163,-0.190393,29,51.490945,-0.18119,30,64016293,180,13909,'2017-04-12 21:41:00,219',"Bramham Gardens, Earl's Court",'2017-04-12 21:44:00,216',"Old Brompton Road, South Kensington",2017],
[51.490163,-0.190393,29,51.490945,-0.18119,30,64334332,180,11693,'2017-04-23 19:20:00,219',"Bramham Gardens, Earl's Court",'2017-04-23 19:23:00,216',"Old Brompton Road, South Kensington",2017],
[51.490163,-0.190393,29,51.490945,-0.18119,30,64567541,240,4552,'2017-05-01 20:12:00,219',"Bramham Gardens, Earl's Court",'2017-05-01 20:16:00,216',"Old Brompton Road, South Kensington",2017],
[51.490163,-0.190393,29,51.490945,-0.18119,30,64787260,180,5270,'2017-05-08 19:44:00,219',"Bramham Gardens, Earl's Court",'2017-05-08 19:47:00,216',"Old Brompton Road, South Kensington",2017]
]


map.on('style.load', () => {
  data.forEach((d) => {
    let origin = [d[0],d[1]],
        destination = [d[3],d[4]],
        route = {
          'type': 'FeatureCollection',
          'features': [
            {
              'type':'Feature',
              'geometry': {
                'type': 'LineString',
                'coordinates': [orgin, destination]
              }
            }
          ]
        },
        point = {
          'type': 'FeatureCollection',
          'features': [
            {
              'type':'Feature',
              'properties': {},
              'geometry': {
                'type': 'Point',
                'coordinates': origin
              }
            }
          ]
        }
  
  
  
  
  
      })


})