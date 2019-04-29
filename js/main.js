// Adding the base map
var basemap;

//Begine function create map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [32.00903, 118.6969],
        zoom:12,
		minzoom:2,
		maxzoom:18
    });

    //add OSM base tilelayer
    var basemap =  L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
	attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    }).addTo(map);
};
//End function create map


//Loading geoJson data file
$.getJSON("popular_POIs_AOIs_corrected.geojson",function(data){
    // add GeoJSON layer to the map once the file is loaded
    L.geoJson(data,{
		onEachFeature:function(feature, layer){
			layer.bindPopup(feature.properties.name);
		}
	}).addTo(map);
});

$(document).ready(createMap);