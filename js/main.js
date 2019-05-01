// Adding the base map
var basemap;

//Begine function to create map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [32.00983, 118.7969],
        zoom:12,
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


//Begine function to load geoJson data file
function getData (map){
	$.getJSON("data/popular_POIs_AOIs_corrected.geojson",function(data){
	
    // Add GeoJSON layer to the map once the file is loaded

		var dataLayer = L.geoJson(data,{
			
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },
			// Adding popup to POIs
			onEachFeature:function(feature, layer){
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				}
			}).addTo(map);
				console.log(feature.properties)
			}
		});
		
		//create filter by using leaflet default filter function
		var overlayMaps = {
			"PointOfInterest": dataLayer
		};		
		L.control.layers(null, overlayMaps).addTo(map);
		
		//create search operator
		createSearchOperator(map, data);
		
/* 		//create a L.markerClusterGroup layer
		var markers = L.markerClusterGroup();
		//add geojson to marker cluster layer
		markers.addLayer(dataLayer);
		//add marker cluster layer to map
		map.addLayer(markers);
		markerCluster(map); */
		
	});
};


//function to create search operator
function createSearchOperator(map, featCollection){
	//create search layer
	var featuresLayer = new L.LayerGroup({
		style: function(feature) {
			return {color: feature.properties.color }
		},
	});

	map.eachLayer(function(layer){
		featuresLayer.addLayer(layer);
	});
	map.addLayer(featuresLayer);

	//create search control
	var searchControl = new L.Control.Search({
		layer: featuresLayer,
		propertyName: "name",
		marker: false,
		zoom: 15,
	});
	
	searchControl.on('search:locationfound', function(e) {
		e.layer.openPopup();
	}).on('search_collapsed', function(e) {
        featuresLayer.resetStyle(layer);
    });
	
	map.addControl( searchControl ); 
};

//function to create marker cluster
function markerCluster(map){
	var markers = L.markerClusterGroup({
		maxClusterRadius: 120,
		iconCreatefunction: function(cluster){
			var markers = cluster.getAllChildMarkers();
			var n = 0;
			for (var i = 0; i < markers.length; i++){
				n += markers[i].number;
			}
			return L.divIcon({ html: n, className: 'mycluster', iconSize: L.point(40, 40) });
		},
		spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
	});
};

$(document).ready(createMap);