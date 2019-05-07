//// reference:
//leaflet-panel-layers: https://labs.easyblog.it/maps/leaflet-panel-layers/
//leaflet-search: https://labs.easyblog.it/maps/leaflet-search/


// Adding the base map
var basemap;

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
	
	getData(map);
};
//End function create map



//Begine function to load geoJson data file
function getData (map){
	$.getJSON("data/popular_POIs_AOIs_corrected.geojson",function(data){
	
    // Add GeoJSON layer to the map once the file is loaded		
		//create datalayer for 5A景区
		var data_level_5A = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.level === "5A景区");
			},
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
					mouseover: function(){
						this.openPopup();
					},
					mouseout: function(){
						this.closePopup();
					},
					click: function(){
						$("#menu").html(menuContent);
					}
				})
			}
		}).addTo(map);
		
		//create datalayer for 4A景区
		var data_level_4A = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.level === "4A景区");
			},
			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
					mouseover: function(){
						this.openPopup();
					},
					mouseout: function(){
						this.closePopup();
					},
					click: function(){
						$("#menu").html(menuContent);
					}
				})
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
		
		var data_L_Cate_FJMS = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.level === "-" && (feature.properties.medium_category === "风景名胜" || feature.properties.medium_category === "风景名胜相关"));
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				console.log(feature.properties)
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}
				})
			}
		}).addTo(map);		
		var data_L_Cate_GYGC = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.level === "-" && feature.properties.medium_category === "公园广场");
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}				
				})
			}
		}).addTo(map);
		var data_L_Cate_BWG = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "博物馆" || feature.properties.medium_category === "科教文化场所");
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}				
				})
			}
		}).addTo(map);
		var data_L_Cate_XX = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "学校");
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}				
				})
			}
		}).addTo(map);
		var data_L_Cate_TSG = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "图书馆");
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}				
				})
			}
		}).addTo(map);
		var data_L_Cate_MSG = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "美术馆");
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}				
				})
			}
		}).addTo(map);
		var data_L_Cate_TWG = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "天文馆");
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}				
				})
			}
		}).addTo(map);
		var data_L_Cate_XXCS = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "休闲场所");
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}				
				})
			}
		}).addTo(map);
		var data_L_Cate_DJLYS = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "度假疗养场所");
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}				
				})
			}
		}).addTo(map);
		var data_L_Cate_YDCG = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "运动场馆");
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}				
				})
			}
		}).addTo(map);
		var data_L_Cate_YLCS = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "娱乐场所");
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}				
				})
			}
		}).addTo(map);
		var data_L_Cate_TSSYJ = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "特色商业街");
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}				
				})
			}
		}).addTo(map);
		var data_L_Cate_GWXGCS = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "购物相关场所");
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}				
				})
			}
		}).addTo(map);
		var data_L_Cate_SC = L.geoJson(data, {
			filter: function(feature, layer){
				return(feature.properties.medium_category === "商场");
			},
		// Change Leaflet default markers to circles
			pointToLayer: function(feature, latlng) {
				return new L.CircleMarker(latlng, {
				  radius: 5,
				  color: "red",
				  weight: 1
				});
			  },			
			onEachFeature:function(feature, layer){
				var menuContent = "<p><b>Name:</b> " + feature.properties.name + "<p><b>Address:</b> " + feature.properties.address + "<p><b>Rating:</b> " + feature.properties.rating_score + "<p><b>Website:</b> " + "<a href=" + feature.properties.url + ">" + feature.properties.url + "</a>";
				layer.bindPopup(feature.properties.name);
				//Event listeners to open popup on hover and fill panel on click
				layer.on({
				mouseover: function(){
					this.openPopup();
				},
				mouseout: function(){
					this.closePopup();
				},
				click: function(){
					$("#menu").html(menuContent);
				}				
				})
			}
		}).addTo(map);

		
		var overLayers = [
			{
				group: "景区",
				layers: [

					{
						avtive: true,
						name: "5A景区",
						layer: data_level_5A
					},
					{
						avtive: true,
						name: "4A景区",
						layer: data_level_4A		
					},
				]
			},
			{
				collapsed: true,
				group: "风景名胜",
				layers: [

					{
						avtive: true,
						name: "风景名胜",
						layer: data_L_Cate_FJMS
					},
					{
						avtive: true,
						name: "公园广场",
						layer: data_L_Cate_GYGC		
					},
				]
			},
			{
				collapsed: true,
				group: "科教文化服务",
				layers: [

					{
						avtive: true,
						name: "博物馆",
						layer: data_L_Cate_BWG
					},
					{
						avtive: true,
						name: "学校",
						layer: data_L_Cate_XX	
					},
					{
						avtive: true,
						name: "图书馆",
						layer: data_L_Cate_TSG	
					},
					{
						avtive: true,
						name: "美术馆",
						layer: data_L_Cate_MSG	
					},
					{
						avtive: true,
						name: "天文馆",
						layer: data_L_Cate_TWG	
					},
				]
			},
			{
				collapsed: true,
				group: "体育休闲服务",
				layers: [

					{
						avtive: true,
						name: "休闲场所",
						layer: data_L_Cate_XXCS
					},
					{
						avtive: true,
						name: "度假疗养场所",
						layer: data_L_Cate_DJLYS	
					},
					{
						avtive: true,
						name: "运动场馆",
						layer: data_L_Cate_YDCG	
					},
					{
						avtive: true,
						name: "娱乐场所",
						layer: data_L_Cate_YLCS
					},
				]
			},
			{
				collapsed: true,
				group: "购物服务",
				layers: [

					{
						avtive: true,
						name: "特色商业街",
						layer: data_L_Cate_TSSYJ
					},
					{
						avtive: true,
						name: "购物相关场所",
						layer: data_L_Cate_GWXGCS		
					},
					{
						avtive: true,
						name: "商场",
						layer: data_L_Cate_SC		
					},
				]
			}
		];
		var panelLayers = new L.Control.PanelLayers(null, overLayers,{
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
