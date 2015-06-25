var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var markers = [];
var campSites = [];
var waypts = [];
var stops;
var maxMiles;

$(document).ready( function() {
  loadCampsites();
});

function loadCampsites() {
  console.log("LOAD CAMPSITES..")
  // Get a database reference to our posts
  var fbRef = new Firebase("https://brilliant-inferno-6390.firebaseio.com/campsites");

  // Attach an asynchronous callback to read the data at our posts reference
  fbRef.on("value", function(snapshot) {
    var data = snapshot.val();
    for (key in data) {
      var site = data[key];
      var loc = new google.maps.LatLng(site.lat, site.long);
      campSites.push(loc);
    }

    initialize();
  }, function (errorObject) {
    alert("Reading campsites from firebase failed: " + errorObject.code);
  });

}

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  var mapOptions = {
    zoom:7,
    center: chicago
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);

  calcRoute();
}

function newRoute() {
  clearMarkers();
  waypts.length = 0;
  $("#stops").empty();
  initialize();
}

function calcRoute() {
  console.log("calcRoute");

  var start = $("#from").val();
  var end = $("#to").val();
  stops = parseInt($("#days").val()) - 1;
  maxMiles = parseInt($("#miles").val());

  var request = {
    origin:start,
    waypoints: waypts,
    optimizeWaypoints: true,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {

      if (typeof directionsDisplay === "undefined") {
        console.log("undefined");
      } else {
        console.log("status ok");
      }

      directionsDisplay.setDirections(response);

      var path = response.routes[0].overview_path;


      var days = stops + 1;
      var stopAtEvery = Math.floor(path.length / days);

      // $("#stops").empty();

      for (i = 1; i <= stops; i++) {
        var stop = path[i * stopAtEvery];
        campSitesInRange(stop, stops);
      }

    }
  });
}

function addMarkerAt(latlong) {
  myLatlng = new google.maps.LatLng(latlong.A,latlong.F);

  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: 'DEBUG'
  });
  markers.push(marker);
}

function addTentMarkerAt(latlong) {
  myLatlng = new google.maps.LatLng(latlong.A,latlong.F);
  var tentIcon = 'img/tent-marker.png';
  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    icon: tentIcon
  });
  markers.push(marker);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function updatewaypoints() {

  waypts.length = 0;

  $("#stops").children("select").each( function (child) {
    var select = $(this);
    var strLatLong = select.val();

    if (strLatLong !== null) {
      strLatLong = strLatLong[0];
      strLatLong = strLatLong.replace("(","");
      strLatLong = strLatLong.replace(")","");
      var arrLatLong = strLatLong.split(',');
      waypoint = new google.maps.LatLng(parseFloat(arrLatLong[0]),parseFloat(arrLatLong[1]));
      waypts.push({location: waypoint, stopover: true});
    }
  });

  calcRoute();
};


function distanceBetween(pointA, pointB) {
  var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);
  var distanceInMiles = Math.round(distanceBetween * .000621371);
  console.log("distance between " + pointA + " and " + pointB + " is " + distanceInMiles + " miles.");
  return distanceInMiles;
}

function campSitesInRange(latlong, stops) {
  var campingOptions = [];
  for (var i=0; i < campSites.length; i++) {
    var distance = distanceBetween(campSites[i], latlong);
    if (distance <= maxMiles) {
      addTentMarkerAt(campSites[i]);
      campingOptions.push(campSites[i]);
    }
  }

  var alreadyBuilt = $("#stops").children("select").length;
  if (alreadyBuilt < stops) {
    var stopDiv = '<select multiple="multiple" onchange="updatewaypoints();" class=" select select-waypoint" id="' + latlong + '">';
    for (var i = 0; i < campingOptions.length; i++) {
      stopDiv += '<option value="' + campingOptions[i] + '">Campsite' + (i+1) + '</option>';
    }
    stopDiv += '</select>';
    $("#stops").append(stopDiv);
  }
}

// google.maps.event.addDomListener(window, 'load', initialize);
