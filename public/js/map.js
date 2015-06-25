var firebaseRef = new Firebase("https://brilliant-inferno-6390.firebaseio.com/");

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var markers = [];


var testCampsite1 = new google.maps.LatLng(37.50959, -109.654022);
var testCampsite2 = new google.maps.LatLng(40.742445, -113.002968);
var testCampsite3 = new google.maps.LatLng(29.047225, -81.509146);
var testCampsite4 = new google.maps.LatLng(41.292061, -99.922928);
var testCampsite5 = new google.maps.LatLng(41.162735, -100.850230);

var campSites = [testCampsite1, testCampsite2, testCampsite3, testCampsite4, testCampsite5];
var waypts = [];
var stops = 2;

console.log(campSites.length);

var maxMiles = 100;

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



function calcRoute() {
  console.log("calcRoute");

  var end = "detroit, mi";
  var start = "portland, or";
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
        // addMarkerAt(stop);
        markers.push(stop);
        console.log ("setting marker # " + i);
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
    title: 'Hello World!'
  });
}

function addTentMarkerAt(latlong) {
  myLatlng = new google.maps.LatLng(latlong.A,latlong.F);
  var tentIcon = 'img/tent-marker.png';
  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    icon: tentIcon
  });
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
  // waypts.push({location: marker.getPosition(), stopover: true})
  calcRoute();
};


function distanceBetween(pointA, pointB) {
  var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);
  var distanceInMiles = Math.round(distanceBetween * .000621371);
  console.log("distance between " + pointA + " and " + pointB + " is " + distanceInMiles + " miles.");
  return distanceInMiles;
}

function campSitesInRange(latlong, stops) {

  var alreadyBuilt = $("#stops").children("select").length;

  if (stops === alreadyBuilt) {
    return
  }

  // <h4 class="waypoint-title">Waypoint ' + (alreadyBuilt + 1) + '</h4>

  var stopDiv = '<select multiple="multiple" onchange="updatewaypoints();" class=" select select-waypoint" id="' + latlong + '">';

  console.log("campSitesInRange with: " + latlong);
  var campingOptions = [];
  console.log(campSites.length);
  for (var i=0; i < campSites.length; i++) {
    console.log(i);
    var distance = distanceBetween(campSites[i], latlong);
    if (distance <= maxMiles) {
      addTentMarkerAt(campSites[i]);
      campingOptions.push(campSites[i]);

      stopDiv += '<option value="' + campSites[i] + '">Campsite' + (i+1) + '</option>';
    }
    console.log(campingOptions);
  }
  stopDiv += '</select>';
  console.log(stopDiv);
  $("#stops").append(stopDiv);
}


$(document).ready( function() {

});


google.maps.event.addDomListener(window, 'load', initialize);
