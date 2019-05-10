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

var data_L_Cate_YLCS_H

var panelLayers
var searchControl
var score_filter_points
var score_filter_polygons

var parkIcon
var parkIcon2
var parkMarker

var metroLines
var metroStops

var ptLayer = {
	radius: 6.5,
	fillColor: "orange",
	color: "blue",
	weight: 2,
	fillOpacity: 0.8
}

var legend1 = L.control({position: 'bottomleft'});

/*
var parkIcon = L.icon({
	iconUrl: 'img/park.png',
	iconSize: [24,24],
	iconAnchor: [12,24]
})*/

var metroIcon = L.Icon.extend({
    options: {
		iconSize: [12,12],
        iconAnchor:   [6, 6],
    }
})

$('#compare_window').hide()
$('#ranking_window').hide()

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
	get_metroData(map)

	$('#rating_score').on({
		'click': function() {
			set_compare_window()
			getData1(map);
		}
	})
	$('#rating_count').on({
		'click': function() {
			set_ranking_window()
			getData2(map);
		}
	})
};

function get_metroData(map) {
	/*colors = ['#6dbfe8','#da4a55','#5ea459','#9d5bd1','#b49367','#3c9191','#e074bc','#e074bc','#e37b94','#c66b38','#f8ce44']
	legend1.onAdd = function (map) {
			
		var div = L.DomUtil.create('div', 'info legend')
		div.innerHTML = '<div id="legend_title"><b>Price per person</b></div>'
			grades = [0, 535, 690, 862.5, 1065, 1310, 1830],
			labels = [];

		for (var i = grades.length - 2; i >= 0; i--) {
			div.innerHTML += '<i style="background:' + colors[i] + '"></i> $'
				+ grades[i] + (grades[i + 1] ? '&nbsp&ndash;&nbsp$' + grades[i + 1] + '<br>' : '+')
		}
		div.innerHTML += '<i style="background:' + '#cccccc' + '"></i>no such floorplan<br>';

		return div;
	};
	legend1.addTo(map)*/

	$.getJSON("data/metroStops.geojson", function(data) {
		metroStops = L.geoJson(data, {
			pointToLayer: function(feature, latlng) {
				var stopIcon = new metroIcon({iconUrl: 'img/metro_sign.png'})
				//stopIcon.setOpacity(0.9)
				return L.marker(latlng, {icon: stopIcon})
			},
			onEachFeature: function(feature, layer) {
				var stopTT = '<div>' + feature.properties.nameStop + '</div>'
				layer.bindTooltip(stopTT, {'permanent':true, 'direction': 'top', 'offset':new L.Point(0, -3)})
			}
		}).addTo(map)
	})
	$.getJSON("data/metroLines2.geojson", function(data) {

		metroLines = L.geoJson(data, {
			style: function(feature, layer){
				console.log('features?',feature)
				if (feature.properties.nameAbbrev == '1') {
					return ({color:'#6dbfe8'})
				}
				if (feature.properties.nameAbbrev == '2') {
					return ({color:'#da4a55'})
				}
				if (feature.properties.nameAbbrev == '3') {
					return ({color: '#5ea459'})
				}
				if (feature.properties.nameAbbrev == '4') {
					return ({color: '#9d5bd1'})
				}
				if (feature.properties.nameAbbrev == '10') {
					return ({color: '#b49367'})
				}
				if (feature.properties.nameAbbrev == 's1') {
					return ({color: '#3c9191'})
				}
				if (feature.properties.nameAbbrev == 's3') {
					return ({color: '#e074bc'})
				}
				if (feature.properties.nameAbbrev == 's7') {
					return ({color: '#e37b94'})
				}
				if (feature.properties.nameAbbrev == 's8') {
					return ({color: '#c66b38'})
				}
				if (feature.properties.nameAbbrev == 's9') {
					return ({color: '#f8ce44'})
				}
			}
		}).addTo(map)
		metroLines.bringToBack()
	})
}

function set_menuMap(map) {
	$.getJSON("data/popular_POIs_AOIs_corrected.geojson", function(data) {
		menuMap_poi = L.geoJson(data, {
			style: function() {
				return ({'color': '#444444', 'fillColor': '#a5a5a5', 'fillOpacity': 0.7, 'weight': 1})
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
				return ({'color': '#444444', 'fillColor': '#777777', 'fillOpacity': 0.7, 'weight': 1})
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

function set_ranking_window() {
	$('#menu').hide()
	$('#ranking_window').show()
	$('.back_to_menu').off('click')
}

//End function create map

/*function changeIcon(data, map, name_h) {
	data_L_Cate_YLCS_H = L.geoJson(data, {
		filter: function(feature, layer){
			if (feature.properties.name == name_h) {
				console.log('yes')
			}

			return(feature.properties.name == name_h);
		},
		pointToLayer: function(feature, latlng) {
			parkMarker = L.marker(latlng, {icon: parkIcon2})
			return parkMarker
		},				
		onEachFeature:function(feature, layer){
			layer.on({
				mouseout: function() {
					map.removeLayer(data_L_Cate_YLCS_H)
					return
				}
			})
		}
	}).addTo(map);
}*/

function highlightPoints(feature, layer, map) {
	var menuContent = "<div id='menu_content'><p><b>Name:</b> " + feature.properties.name + '</p><p><b>Type:</b> ' + feature.properties.medium_category + "</p><p><b>Address:</b> " + feature.properties.address + "</p><p><b>Rating score:</b> " + feature.properties.rating_score + "</p><p><b>Rating count:</b> " + feature.properties.rating_count + " ratings</p><p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a></p></div>";
	layer.bindPopup('<div style="text-align: left; line-height: 28px">Name: ' + feature.properties.name + '<br>Type: ' + feature.properties.medium_category + '</div>');
	//Event listeners to open popup on hover and fill panel on click
	layer.on({
		mouseover: function(e){
			e.target.closePopup()
			var popup = e.target.getPopup();
			popup.setLatLng(e.latlng).openOn(map);
			this.openPopup()
			this.setStyle({color:"black",fillColor:'#e0e922',weight: 3.5})
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

function highlight_filtered_points(feature, layer, map) {
	var menuContent = "<div id='menu_content'><p><b>Name:</b> " + feature.properties.name + '</p><p><b>Type:</b> ' + feature.properties.medium_category + "</p><p><b>Address:</b> " + feature.properties.address + "</p><p><b>Rating score:</b> " + feature.properties.rating_score + "</p><p><b>Rating count:</b> " + feature.properties.rating_count + " ratings</p><p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a></p></div>";
	layer.bindPopup('<div style="text-align: left; line-height: 28px">Name: ' + feature.properties.name + '<br>Type: ' + feature.properties.medium_category + '</div>');
	//Event listeners to open popup on hover and fill panel on click
	layer.on({
		mouseover: function(e){
			e.target.closePopup()
			var popup = e.target.getPopup();
			popup.setLatLng(e.latlng).openOn(map);
			//this.openPopup()
			this.setStyle({color:"black",fillColor:'#e0e922',weight: 3.5})
		},
		mouseout: function(){
			this.closePopup();
			this.setStyle({color:"black",fillColor:'white',weight: 2})
		},
		/*mousemove: function(e) {
			e.target.closePopup()
			var popup = e.target.getPopup();
    		popup.setLatLng(e.latlng).openOn(map);
		},*/
		click: function(){
			$('#menu_content').remove()
			$("#compare_window").append(menuContent)
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
			this.setStyle({color:'blue',weight:3,fillColor:'yellow',fillOpacity:0.8})
		},
		mouseout: function() {
			this.closePopup()
			this.setStyle({color:'#6699ee',weight:3,fillColor:'orange',fillOpacity:0.4})
		},
		click: function(){
			$('#menu_content').remove()
			$("#compare_window").append(menuContent);
		}
	})
}

function highlight_filtered_polygons(feature, layer, map) {
	//var menuContent = "<div id='menu_content'><p><b>Name:</b> " + feature.properties.name + '</p><p><b>Type:</b> ' + feature.properties.medium_category + "</p><p><b>Address:</b> " + feature.properties.address + "</p><p><b>Rating score:</b> " + feature.properties.rating_score + "</p><p><b>Rating count:</b> " + feature.properties.rating_count + " ratings</p><p><b>Website</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a></p></div>";

	//layer.bindPopup('<div style="text-align: left; line-height: 28px">Name: ' + feature.properties.name + '<br>Type: ' + feature.properties.medium_category + '</div>');
	layer.on({
		mouseover: function(e) {
			e.target.closePopup()
			var popup = e.target.getPopup();
			popup.setLatLng(e.latlng).openOn(map);			
			this.setStyle({fillColor:'yellow',fillOpacity:0.8})
		},
		mouseout: function() {
			this.closePopup()
			this.setStyle({fillColor:'blue',fillOpacity:0.6})
		},
		click: function(){
			$('#menu_content').remove()
			$("#compare_window").append(menuContent);
		}
	})
}


function loadTA(data, map) {
	//create datalayer for 5A景区

	data_level_5A = L.geoJson(data, {
		style: function(feature, layer) {
			return ({color:'#6699ee',weight:3,'fillColor':'orange','fillOpacity':0.4})
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
			return ({color:'#6699ee',weight:3,'fillColor':'orange','fillOpacity':0.4})
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

			//parkMarker = L.marker(latlng, {icon:parkIcon}).addTo(map)
		},			
		onEachFeature:function(feature, layer){
			/*layer.on({
				mouseover: function(e) {
					map.removeLayer(parkMarker)
				}
			})*/
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
}

function createOverLayers(map) {
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
}

//Begine function to load geoJson data file
function getData1 (map){
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

			map.removeLayer(score_filter_points)
			map.removeLayer(score_filter_polygons)
		}
	})
	$.getJSON("data/111_pois_aois_with_rating_count_ranking.geojson",function(data) {
	
    // Add GeoJSON layer to the map once the file is loaded		
		loadTA(data, map)
		// Rating score filter
		$("input[name='score']").click(function(){
			$('#filterTT').prop('checked', false);

			if (map.hasLayer(score_filter_polygons)) {
				score_filter_polygons.clearLayers()
			}
			if (map.hasLayer(score_filter_points)) {
				score_filter_points.clearLayers()
			}
			var radioValue = parseFloat($("input[name='score']:checked").val());
			console.log('value?',radioValue)
			score_filter = L.geoJson(data, {
				onEachFeature: function(feature, layer) {
					layer.unbindTooltip()
				}
			})
			if (radioValue != 0) {
				score_filter_points = L.geoJson(data, {
					filter: function(feature) {
						console.log(feature.properties.rating_score, radioValue)
						return(feature.properties.rating_score == radioValue && feature.geometry.type == 'Point')
					},
					pointToLayer: function(feature, latlng) {
						return L.circleMarker(latlng, {
							radius: 6.5,
							fillColor: "white",
							color: "black",
							weight: 2,
							fillOpacity: 0.8
						})
					},
					onEachFeature: function(feature, layer) {
						var tooltipContent = '<div>' + feature.properties.name + '</div>'
						layer.bindTooltip(tooltipContent, {'permanent':true, 'direction':'top','opacity':'0.85', 'offset':new L.Point(0, -5)})

						$('#filterTT').change(function() {
							if (this.checked) {
								layer.unbindTooltip()
							} else {
								layer.bindTooltip(tooltipContent, {'permanent':true, 'direction':'top','opacity':'0.85', 'offset':new L.Point(0, -5)})
							}
						})
						
						if (feature.geometry.type == 'Point') {
							highlight_filtered_points(feature, layer, map)
						}
					}
				}).addTo(map)

				score_filter_polygons = L.geoJson(data, {
					filter: function(feature) {
						console.log(feature.properties.rating_score, radioValue)
						return(feature.properties.rating_score == radioValue && feature.geometry.type == 'Polygon')
					},
					style: function() {
						return ({
							fillColor: 'blue',
							fillOpacity: 0.7,
						})	
					},
					onEachFeature: function(feature, layer) {
						var tooltipContent = '<div>' + feature.properties.name + '</div>'
						console.log("CHECKING filter")

						layer.bindTooltip(tooltipContent, {'permanent':true, 'direction':'top','opacity':'0.85', 'offset':new L.Point(0, -5)})

						$('#filterTT').change(function() {
							if (this.checked) {
								layer.unbindTooltip()
							} else {
								layer.bindTooltip(tooltipContent, {'permanent':true, 'direction':'top','opacity':'0.85', 'offset':new L.Point(0, -5)})
							}
						})
						
						if (feature.geometry.type == 'Polygon') {
							
						}
					}
				}).addTo(map)
				score_filter_polygons.bringToBack()
			}
		})
		createOverLayers(map)
	});
};

function getData2 (map){
	map.removeLayer(menuMap_poi)
	map.removeLayer(menuMap_aoi)
	$('.back_to_menu').on({
		click: function() {
			// remove all layers added in the "compare" functionality, and load default overview, non-interactive map on the menu
			map.removeControl(panelLayers)
			map.removeControl(searchControl)
			set_menuMap(map)
			$('#menu').show()
			$('#ranking_window').hide()
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

			map.removeLayer(score_filter_points)
			map.removeLayer(score_filter_polygons)
		}
	})
	$.getJSON("data/111_pois_aois_with_rating_count_ranking.geojson",function(data) {
	
    // Add GeoJSON layer to the map once the file is loaded		
		loadTA(data, map)
		// Rating score filter
		$("input[name='score']").click(function(){
			$('#filterTT').prop('checked', false);

			if (map.hasLayer(score_filter_polygons)) {
				score_filter_polygons.clearLayers()
			}
			if (map.hasLayer(score_filter_points)) {
				score_filter_points.clearLayers()
			}
			var radioValue = parseFloat($("input[name='score']:checked").val());
			console.log('value?',radioValue)
			score_filter = L.geoJson(data, {
				onEachFeature: function(feature, layer) {
					layer.unbindTooltip()
				}
			})
			if (radioValue != 0) {
				score_filter_points = L.geoJson(data, {
					filter: function(feature) {
						console.log(feature.properties.rating_score, radioValue)
						return(feature.properties.rating_score == radioValue && feature.geometry.type == 'Point')
					},
					pointToLayer: function(feature, latlng) {
						return L.circleMarker(latlng, {
							radius: 6.5,
							fillColor: "white",
							color: "black",
							weight: 2,
							fillOpacity: 0.8
						})
					},
					onEachFeature: function(feature, layer) {
						var tooltipContent = '<div>' + feature.properties.name + '</div>'
						layer.bindTooltip(tooltipContent, {'permanent':true, 'direction':'top','opacity':'0.85', 'offset':new L.Point(0, -5)})

						$('#filterTT').change(function() {
							if (this.checked) {
								layer.unbindTooltip()
							} else {
								layer.bindTooltip(tooltipContent, {'permanent':true, 'direction':'top','opacity':'0.85', 'offset':new L.Point(0, -5)})
							}
						})
						
						if (feature.geometry.type == 'Point') {
							highlight_filtered_points(feature, layer, map)
						}
					}
				}).addTo(map)

				score_filter_polygons = L.geoJson(data, {
					filter: function(feature) {
						console.log(feature.properties.rating_score, radioValue)
						return(feature.properties.rating_score == radioValue && feature.geometry.type == 'Polygon')
					},
					style: function() {
						return ({
							fillColor: 'blue',
							fillOpacity: 0.7,
						})	
					},
					onEachFeature: function(feature, layer) {
						var tooltipContent = '<div>' + feature.properties.name + '</div>'
						console.log("CHECKING filter")

						layer.bindTooltip(tooltipContent, {'permanent':true, 'direction':'top','opacity':'0.85', 'offset':new L.Point(0, -5)})

						$('#filterTT').change(function() {
							if (this.checked) {
								layer.unbindTooltip()
							} else {
								layer.bindTooltip(tooltipContent, {'permanent':true, 'direction':'top','opacity':'0.85', 'offset':new L.Point(0, -5)})
							}
						})
						
						if (feature.geometry.type == 'Polygon') {
							
						}
					}
				}).addTo(map)
				score_filter_polygons.bringToBack()
			}
		})
		createOverLayers(map)
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
