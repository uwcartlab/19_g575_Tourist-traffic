//// reference:
//leaflet-panel-layers: https://labs.easyblog.it/maps/leaflet-panel-layers/
//leaflet-search: https://labs.easyblog.it/maps/leaflet-search/


// Adding the base map
var basemap
var menuMap_poi
var menuMap_aoi
var data_level_5A
var data_level_4A
var data_L_Cate_FJMS
var data_L_Cate_GYGC
var data_L_Cate_BWG
var data_L_Cate_XX
var data_L_Cate_TSG
var data_L_Cate_MSG
var data_L_Cate_TWG
var data_L_Cate_XXCS
var data_L_Cate_DJLYS

var data_L_Cate_YDCG
var data_L_Cate_YLCS

var data_L_Cate_TSSYJ
var data_L_Cate_GWXGCS
var data_L_Cate_SC

var panelLayers
var searchControl


var ptLayer = {
	radius: 6.5,
	fillColor: "orange",
	color: "blue",
	weight: 2,
	fillOpacity: 0.8
}

$('#compare_window').hide()
/* //test
$('#menu').append('<button class="apart" id="apart">apart</button>');
$('#menu').append('<button class="house" id="house">house</button>');

$('.apart').click(function(){
	house.style.backgroundColor = 'red'
});
$('.house').click(function(){
	apart.style.backgroundColor = 'green'
}); */

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
	
	$('#menu').append("<br><button id='rating_score'>Compare by rating score</button>")
	$('#menu').append("<br><button id='rating_count'>Compare by rating count</button>")

	$('#menu').append("<br><button id='bus_routes'>Explore bus routes (now unavailable)</button>")

	set_menuMap(map)

	$('#rating_score').on({
		'click': function() {
			set_compare_window()
			getData(map);
		}
	})
};

function set_menuMap(map) {
	$.getJSON("data/popular_POIs_AOIs_corrected.geojson", function(data) {
		menuMap_poi = L.geoJson(data, {
			style: function() {
				return ({'color': '#444444', 'fillColor': '#a5a5a5', 'fillOpacity': 0.8, 'weight': 1})
			},
			filter: function(feature){
				return(feature.properties.level === "4A景区" || feature.properties.level === "5A景区");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, {
					radius: 6.5,
					color: "999999",
					weight: 1,
					fillOpacity: 0.9
				})
			}
		}).addTo(map)
		menuMap_aoi = L.geoJson(data, {
			style: function() {
				return ({'color': '#444444', 'fillColor': '#777777', 'fillOpacity': 0.8, 'weight': 1})
			},
			filter: function(feature) {
				return (feature.properties.level !== "4A景区" && feature.properties.level !== "5A景区")
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, {
					radius: 6.5,
					fillColor: "#232323",
					color: "999999",
					weight: 1,
					fillOpacity: 0.9
				})
			}
		}).addTo(map)
	})
}

function set_compare_window() {
	$('#menu').hide()
	$('#compare_window').show()
	$('.back_to_menu').off('click')
}

//End function create map

function highlightPoints(feature, layer, map) {
	var menuContent = "<div id='menu_content'><p><b>Name:</b> " + feature.properties.name + '</p><p><b>Type:</b> ' + feature.properties.medium_category + "</p><p><b>Address:</b> " + feature.properties.address + "</p><p><b>Rating score:</b> " + feature.properties.rating_score + "</p><p><b>Rating count:</b> " + feature.properties.rating_count + " ratings</p><p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a></p></div>";
	layer.bindPopup('<div style="text-align: left; line-height: 28px">Name: ' + feature.properties.name + '<br>Type: ' + feature.properties.medium_category + '</div>');
	//Event listeners to open popup on hover and fill panel on click
	layer.on({
		mouseover: function(e){
			e.target.closePopup()
			var popup = e.target.getPopup();
			popup.setLatLng(e.latlng).openOn(map);
			//this.openPopup()
			this.setStyle({color:"black",fillColor:'white',weight: 2})
		},
		mouseout: function(){
			this.closePopup();
			this.setStyle({color:"blue",fillColor:'orange',weight: 2})
		},
		/*mousemove: function(e) {
			e.target.closePopup()
			var popup = e.target.getPopup();
    		popup.setLatLng(e.latlng).openOn(map);
		},*/
		click: function(){
			$('#menu_content').remove()
			$("#compare_window").append(menuContent);

			//$("#menu").html(menuContent);
		}				
	})
}

function highlightPolygons(feature, layer, map) {
	var menuContent = "<div id='menu_content'><p><b>Name:</b> " + feature.properties.name + '</p><p><b>Type:</b> ' + feature.properties.medium_category + "</p><p><b>Address:</b> " + feature.properties.address + "</p><p><b>Rating score:</b> " + feature.properties.rating_score + "</p><p><b>Rating count:</b> " + feature.properties.rating_count + " ratings</p><p><b>Website</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a></p></div>";

	layer.bindPopup('<div style="text-align: left; line-height: 28px">Name: ' + feature.properties.name + '<br>Type: ' + feature.properties.medium_category + '</div>');
	layer.on({
		mouseover: function(e) {
			e.target.closePopup()
			var popup = e.target.getPopup();
			popup.setLatLng(e.latlng).openOn(map);			
			this.setStyle({fillColor:'yellow',fillOpacity:0.8})
		},
		mouseout: function() {
			this.closePopup()
			this.setStyle({fillColor:'orange',fillOpacity:0.4})
		},
		click: function(){
			$('#menu_content').remove()
			$("#compare_window").append(menuContent);
		}
	})
}

//Begine function to load geoJson data file
function getData (map){
	map.removeLayer(menuMap_poi)
	map.removeLayer(menuMap_aoi)
	$('.back_to_menu').on({
		click: function() {
			// remove all layers added in the "compare" functionality, and load default overview, non-interactive map on the menu
			map.removeControl(panelLayers)
			map.removeControl(searchControl)
			set_menuMap(map)
			$('#menu').show()
			$('#compare_window').hide()
			map.removeLayer(data_level_5A)
			map.removeLayer(data_level_4A)
			map.removeLayer(data_L_Cate_FJMS)
			map.removeLayer(data_L_Cate_GYGC)
			map.removeLayer(data_L_Cate_BWG)
			map.removeLayer(data_L_Cate_XX)
			map.removeLayer(data_L_Cate_TSG)
			map.removeLayer(data_L_Cate_MSG)
			map.removeLayer(data_L_Cate_TWG)
			map.removeLayer(data_L_Cate_XXCS)
			map.removeLayer(data_L_Cate_DJLYS)
			map.removeLayer(data_L_Cate_YDCG)
			map.removeLayer(data_L_Cate_YLCS)
			map.removeLayer(data_L_Cate_TSSYJ)
			map.removeLayer(data_L_Cate_GWXGCS)
			map.removeLayer(data_L_Cate_TSSYJ)
			map.removeLayer(data_L_Cate_SC)
		}
	})
	$.getJSON("data/popular_POIs_AOIs_corrected.geojson",function(data) {
	
    // Add GeoJSON layer to the map once the file is loaded		
		//create datalayer for 5A景区
		data_level_5A = L.geoJson(data, {
			style: function(feature, layer) {
				return ({'fillColor':'orange','fillOpacity':0.4})
			},
			filter: function(feature, layer){
				return(feature.properties.level === "5A景区");
			},
			onEachFeature:function(feature, layer){
				highlightPolygons(feature, layer, map)
			}
		}).addTo(map);
		
		//create datalayer for 4A景区
		data_level_4A = L.geoJson(data, {
			style: function(feature, layer) {
				return ({'fillColor':'orange','fillOpacity':0.4})
			},
			filter: function(feature, layer){
				return(feature.properties.level === "4A景区");
			},
			onEachFeature:function(feature, layer){
				highlightPolygons(feature, layer, map)
			}
		}).addTo(map);
		
		//create search operator
		createSearchOperator(map, data);
		
/* 		//create a L.markerClusterGroup layer
		var markers = L.markerClusterGroup();
		//add geojson to marker cluster layer
		markers.addLayer(dataLayer);
		//add marker cluster layer to map
		map.addLayer(markers);
		markerCluster(map); */
		
		data_L_Cate_FJMS = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.level === "-" && (feature.properties.medium_category === "风景名胜" || feature.properties.medium_category === "风景名胜相关"));
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
		  	},			
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);		
		data_L_Cate_GYGC = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.level === "-" && feature.properties.medium_category === "公园广场");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
			},			
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);
		data_L_Cate_BWG = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "博物馆" || feature.properties.medium_category === "科教文化场所");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
		  	},			
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);
		data_L_Cate_XX = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "学校");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
		  	},		
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);
		data_L_Cate_TSG = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "图书馆");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
		  	},				
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);
		data_L_Cate_MSG = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "美术馆");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
			},				
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);
		data_L_Cate_TWG = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "天文馆");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
			},				
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);
		data_L_Cate_XXCS = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "休闲场所");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
			},				
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);
		data_L_Cate_DJLYS = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "度假疗养场所");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
			},				
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);
		data_L_Cate_YDCG = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "运动场馆");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
			},				
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);
		data_L_Cate_YLCS = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "娱乐场所");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
			},				
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);
		data_L_Cate_TSSYJ = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "特色商业街");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
			},				
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);
		data_L_Cate_GWXGCS = L.geoJson(data, {
			filter: function(feature, layer) {
				return(feature.properties.medium_category === "购物相关场所");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
			},			
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);
		data_L_Cate_SC = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "商场");
			},
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, ptLayer)
			},				
			onEachFeature:function(feature, layer){
				highlightPoints(feature, layer, map)
			}
		}).addTo(map);
		
		var overLayers = [
			{
				group: "Level",
				layers: [
					{
						avtive: true,
						name: "5A-level Tourist Attraction",
						layer: data_level_5A
					},
					{
						avtive: true,
						name: "4A-level Tourist Attraction",
						layer: data_level_4A		
					},
				]
			},
			{
				collapsed: true,
				group: "Tourist Attraction",
				layers: [

					{
						avtive: true,
						name: "Scenary Spot",
						layer: data_L_Cate_FJMS
					},
					{
						avtive: true,
						name: "Park & Square",
						layer: data_L_Cate_GYGC		
					},
				]
			},
			{
				collapsed: true,
				group: "Science/Culture & Education Service",
				layers: [

					{
						avtive: true,
						name: "Museum",
						layer: data_L_Cate_BWG
					},
					{
						avtive: true,
						name: "School/University",
						layer: data_L_Cate_XX	
					},
					{
						avtive: true,
						name: "Library",
						layer: data_L_Cate_TSG	
					},
					{
						avtive: true,
						name: "Art Gallary",
						layer: data_L_Cate_MSG	
					},
					{
						avtive: true,
						name: "Planetarium",
						layer: data_L_Cate_TWG	
					},
				]
			},
			{
				collapsed: true,
				group: "Sports & Recreation",
				layers: [

					{
						avtive: true,
						name: "Recreation Place",
						layer: data_L_Cate_XXCS
					},
					{
						avtive: true,
						name: "Holiday & Nursing Resort",
						layer: data_L_Cate_DJLYS	
					},
					{
						avtive: true,
						name: "Sports Stadium",
						layer: data_L_Cate_YDCG	
					},
					{
						avtive: true,
						name: "Recreation Center",
						layer: data_L_Cate_YLCS
					},
				]
			},
			{
				collapsed: true,
				group: "Shopping",
				layers: [

					{
						avtive: true,
						name: "Commercial Street",
						layer: data_L_Cate_TSSYJ
					},
					{
						avtive: true,
						name: "Shopping-related Places",
						layer: data_L_Cate_GWXGCS		
					},
					{
						avtive: true,
						name: "Shopping Plaza",
						layer: data_L_Cate_SC		
					},
				]
			}
		];
		panelLayers = new L.Control.PanelLayers(null, overLayers,{
			collapsibleGroups: true,
			position: 'topright',
			compact: true
		});
		map.addControl(panelLayers);
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
	searchControl = new L.Control.Search({
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
	
	map.addControl(searchControl); 
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
