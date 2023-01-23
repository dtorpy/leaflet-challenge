//function to create map
function createMap(earthquakebase){
  // Add a tile layer.
  var mapbase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  // Create an overlayMaps object to hold the earthquake layer.
  var basemaps = {
    "Map": mapbase
  };
  // Create an overlayMaps object to hold the earthquake layer.
  var overlayMaps = {
    "Earthquake": earthquakebase
  };
  // Create a map object.
  var map = L.map("map", {
    center: [39.3812, 17.0673],
    zoom: 3,
    layers: [mapbase,earthquakebase]
  });
  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(basemaps, overlayMaps, {
  collapsed: false 
  }).addTo(map);
}


 // use link to GeoJSON Data
var link ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Set Mag Range colors
function depthColor(depth) {
    if (depth >= 90) {return "red" }
    else if (depth > 70) {return "orange"}
    else if (depth > 50) {return "yellow"}
    else if (depth > 30) {return "green"}
    else if (depth > 10) {return "blue" } 
    else return "purple"}

//function for Markers

function createMarkers(response){

//pull in earthquake data
var earthquakeData= response.features;

  // Initialize an array to hold earthquake Markers.
  var earthquakeMarkers = [];

 // Loop through the earthquake Marker array.
 for (var index = 0; index < earthquakeData.length; index++) {
  var earthquake = earthquakeData[index];
  //variable for mag location
 var magnitude = earthquake.properties.mag;

  // For each earthquake, create a marker, and bind a popup with the station's name.
  var earthquakeMarker = L.circle(earthquake.geometry.coordinates,{
    color: "black",
    fillColor: depthColor(earthquake.geometry.coordinates[2]),
    fillOpacity:0.75,
    radius: magnitude*50000
  })
    .bindPopup("<h3>" + earthquake.properties.place + "<h3><h3>mag: " + earthquake.properties.mag + "<h3><h3>time: " + new Date(earthquake.properties.time) + "</h3>");
   
    // Add the marker to the earthquakeMarkers array.
    earthquakeMarkers.push(earthquakeMarker);
  }
   // Create a layer group that's made from the markers array, and pass it to the createMap function.
   createMap(L.layerGroup(earthquakeMarkers));
}

  //Get Data
  d3.json(link).then(createMarkers);

// Create map legend
var legend = L.control({
  position: "bottomleft"
});
legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [0,10,30,50,70,90];
  var labels = [];
  var legendInfo = "<h4>Depth</h4>";

  div.innerHTML = legendInfo

  // loop through to label and color the legend
   //push to labels array as list item
  for (var i = 0; i < grades.length; i++) {
        labels.push('<ul style="background-color:' + depthColor(grades[i] + 20) + '"> <span>' + grades[i] + (grades[i + 20] ? '&ndash;' + grades[i + 20] + '' : '+') + '</span></ul>');
      

   // add each label list item to the div under the <ul> tag
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  }
  console.log(labels)
  return div;

};

legend.addTo(map);

