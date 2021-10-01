var urlPath = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(urlPath).then(function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Where: ${feature.properties.place}</h3><hr><p>When: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p>`);
      };

    function markerSize(magnitude){
        return magnitude * 5
    };
    // This part is cool. Thanks Steve and Google for the switch idea!
    function markerColor(magnitude){
        switch(true){
            case magnitude > 6:
                return "Maroon";
            case magnitude > 5:
                return "Red";
            case magnitude > 4:
                return "OrangeRed";
            case magnitude > 3:
                return "Orange";
            case magnitude > 2:
                return "Yellow";
            default:
                return "Green"
        }
    }
    function markerLayer(feature, latLong) {
        return L.circleMarker(latLong,
            {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag),
                fillOpacity: 0.75,
                color: "Black",
                stroke: true,
                weight: 0.5
            })
    };
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: markerLayer,
        onEachFeature: onEachFeature
    });

    // This part is where we create the markers using various IF statements.


    createMap(earthquakes)
};

function createMap(earthquakes) {
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    
      var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });
    
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    var overlays = {
        "Earthquakes": earthquakes
    };
    var myMap = L.map("map", {
        center: [0, 0],
        zoom: 2,
        layers: [street, earthquakes]
    });
    L.control.layers(baseMaps, overlays, {
    }).addTo(myMap);
};