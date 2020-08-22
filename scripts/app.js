// user info to determine the center
let lat;
let lon;

// map api fetch
mapboxgl.accessToken = 'pk.eyJ1IjoiY29kZXByb2RpZ3kiLCJhIjoiY2tlNWxtNHJjMTRkbjJ6bzRjajlhYmx4MSJ9.HklunmwPVXRpFLP0r-zekg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [0,0]
});

// flights api fetch data
const flight_api = 'https://opensky-network.org/api/states/all';
fetch(flight_api)
.then(response => {
    return response.json();
})
.then(data => {
    let data_array = data.states;
    data_array.forEach((el,index) => {
        var geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                    'iconSize': [40, 40]
                    },
                    'geometry': {
                    'type': 'Point',
                    'coordinates': [el[5],el[6]]
                    }
                }
            ]
        }
        //custom marker
        geojson.features.forEach(marker =>{
            // create a DOM element for the marker
            var plane_marker = document.createElement('div');
            plane_marker.className = 'marker';

            new mapboxgl.Marker(plane_marker)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
        })
    })

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            map.setCenter([lon, lat]);
            map.setZoom(8)
        })
    }

    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    map.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}));
});
