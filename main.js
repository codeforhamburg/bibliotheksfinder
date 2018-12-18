// Mapbox-Account with Access-Token // mapbox-static
mapboxgl.accessToken = 'pk.eyJ1Ijoia2lncmFudHoiLCJhIjoiY2pwamw2MTcxMDgxdzNxcWRjaGsyNjI1YyJ9.5dsqBoRjroU5SgK4OywyFw';


// Basis-"Map"-Einstellungen von Mapbox...https://www.mapbox.com/mapbox-gl-js/api/#map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/kigrantz/cjpjpmeiy0fvl2rp3dvb67d99',
  //   style: 'mapbox://styles/mapbox/satellite-v9',
  center: [13.5729, 51.2302], // Inital Position
  zoom: 9.4, // initial zoom level
  maxZoom: 20, // maximales "reinzoomen"
  minZoom: 2, // maximales "rauszoomen"
  interactive: true, // if false, kein scrollen möglich
  logoPosition: 'bottom-left', // Position des Mapbox Logos, default 'bottom-left'
  keyboard: true, // if false, kann nicht mehr mit den Tastatur-Pfeilen navigiert werden
  hash: true,
});



/* CONTROLS SETTINGS */

// Add zoom, compass and rotation controls to the map.
var nav = new mapboxgl.NavigationControl({
    showCompass: true,
    showZoom: true
  });
map.addControl(nav, "top-right"); // oder top-left , top-right ,  bottom-left ,  bottom-right


// Deaktiviert den Scroll-Zoom per Mouse, options: if 'disable', else 'enable'
map.scrollZoom.enable();

// Deaktiviert disable map rotation using right click + drag, if 'disable'
map.dragRotate.disable();

// Deaktiviert mit 'disable' das verschieben des Kartenausschnitts per by clicking and dragging the cursor
map.dragPan.enable();

// disable map rotation using touch rotation gesture, if 'disableRotation'
map.touchZoomRotate.enableRotation();


/* End of Control Settings */



/* Daten, Points, Polygone */

// lade Daten aus externer file, z.B. data.geojson 
map.on("load", function() {
    map.addSource("hamburg", {
        "type": "geojson",
        "data": 'data/bibfinder.geojson'
    })

    // Layer for Points 
    // More Icons here: https://www.mapbox.com/maki-icons/
    map.addLayer({
        "id": "alster-points",
        "interactive": true,
        // "type": "circle",
        "type": "symbol",
        "source": "hamburg",
        "layout": {
            "icon-image": "star-15",
            "icon-size": 6.25,
            "icon-allow-overlap": true
        },
        // "paint": {
        //     "circle-radius": 12, // Marker size
        //     "circle-color": "yellow" // Marker color
        // },
        "filter": ["==", "$type", "Point"],
    });

    // Layer for Polygons
    map.addLayer({
        "id": "stadtpark-poly",
        "type": "fill",
        "source": "hamburg",
        "paint": {
            "fill-color": "yellow",
            "fill-opacity": 0.6
        },
        "filter": ["==", "$type", "Polygon"]
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'alster-points', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.name;
        var streetAddress = e.features[0].properties.streetAddress;
        var postalCode = e.features[0].properties.postalCode;
        var Locality = e.features[0].properties.Locality;
      var telephone = e.features[0].properties.telephone;
        var email = e.features[0].properties.email;
        var url = e.features[0].properties.url;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
                '<h1>' + name + '</h1>' + 
                '<p>' + streetAddress + '</p>' + 
                '<p>' + postalCode + '</p>' + 
                '<p>' + Locality + '</p>' +
               '<p>' + telephone + '</p>' +
                '<p>' + email + '</p>' + 
                '<p>' + url + '</p>'
                )
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'alster-points', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'alster-points', function () {
        map.getCanvas().style.cursor = '';
    });
});


