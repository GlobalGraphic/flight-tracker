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

const flight_data = () => {
    // flights api fetch data
    var headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa('codehysteria28' + ':' + 'MU2DdufZrHAL7uN'));
    fetch('https://opensky-network.org/api/states/all',{headers: headers})
    .then(response => {
        return response.json();
    })
    .then(data => {
        setTimeout(() => {
            console.log(data);
            console.log('refreshed data');
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
                // create the popup
                var popup = new mapboxgl.Popup({ offset: 25 }).setText(
                'Construction on the Washington Monument began in 1848.'
                );
                //custom marker
                geojson.features.forEach(marker =>{
                    // create a DOM element for the marker
                    var plane_marker = document.createElement('div');
                    plane_marker.className = 'marker';

                    new mapboxgl.Marker(plane_marker)
                    .setLngLat(marker.geometry.coordinates)
                    .setPopup(popup) // sets a popup on this marker
                    .addTo(map);
                })
            })
        },5000)
    });
}

setInterval(() => {
    flight_data();
    let marker = document.querySelectorAll('.marker');
    marker.forEach(function(el,index){
        el.remove();
    });
}, 5000);

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