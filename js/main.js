var basemap;
//Create the Leaflet map
function createMap(){
    //create the map
    var map = L.map('mapid', {
        center: [41.257160, -95.995102],
        zoom:4.5,
		minzoom:2,
		maxzoom:18
    });

    //add OSM base tilelayer
    basemap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //calling the getData function
    getData(map);
};