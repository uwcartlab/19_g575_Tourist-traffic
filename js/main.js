// Adding the base map
var basemap;

//Begine function to create map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [32.00983, 118.7969],
        zoom:11,
		minzoom:2,
		maxzoom:18
    });

    //add OSM base tilelayer
    var basemap =  L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
	attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    }).addTo(map);
	
	getData(map);
};
//End function create map



//Loading geoJson data file
function getData (map){
	$.getJSON("data/popular_POIs_AOIs_corrected.geojson",function(data){
	
    // Add GeoJSON layer to the map once the file is loaded
		L.geoJson(data,{
			// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },
			onEachFeature:function(feature, layer){
			
			// Adding popup to POIs
				layer.bindPopup(feature.properties.name);
				
			//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				}
			});
				console.log(feature.properties)
			}
		}).addTo(map);
	});
};
$(document).ready(createMap);