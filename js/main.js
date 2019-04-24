// Adding the base map
var basemap;

//Begine function create map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [32.00903, 118.6969],
        zoom:10,
		minzoom:2,
		maxzoom:18
    });

    //add OSM base tilelayer
    basemap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);
};
//Begine function create map
$(document).ready(createMap);