var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var overlay = new google.maps.OverlayView();
var map;
var markers = [];
var campSites = [];
var waypts = [];
var stops;
var maxMiles;

$(document).ready( function() {
  console.log("JQ Document Ready");
  console.log("Campsites loaded: " + campSites.length)
  var loadingDiv = '<div class="centered" style="display: none;" id="jq-loading-div"><h1>LOADING...  PLEASE WAIT.</h1><img src="img/ajax-loader.gif" id="loader-img" alt="loading" /></div>';
  $("body").append(loadingDiv);
  if (campSites.length === 0){
    $("#jq-loading-div").show();
    loadCampsites();
  }
});

function loadCampsites() {
  // console.log("LOAD CAMPSITES..")
  // Get a database reference to our posts
  var fbRef = new Firebase("https://brilliant-inferno-6390.firebaseio.com/campsites");
  // Attach an asynchronous callback to read the data at our posts reference
  fbRef.on("value", function(snapshot) {
    var data = snapshot.val();
    for (key in data) {
      var site = data[key];
      // var loc = new google.maps.LatLng(site.lat, site.long);
      site.location = new google.maps.LatLng(site.lat, site.long);
      campSites.push(site);
    }
    console.log("Campsites loaded: " + campSites.length)
    initialize();
    $("#jq-loading-div").hide();
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
  overlay.draw = function() {};
  overlay.setMap(map);
  directionsDisplay.setMap(map);
  calcRoute(true);
}

function newRoute() {
  clearMarkers();
  waypts.length = 0;
  $("#stops").empty();
  initialize();
}

function calcRoute(recalcStops) {
  // console.log("calcRoute");
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
      directionsDisplay.setDirections(response);
      if (recalcStops) {
        var path = response.routes[0].overview_path;
        var days = stops + 1;
        var stopAtEvery = Math.floor(path.length / days);
        for (i = 1; i <= stops; i++) {
          var stop = path[i * stopAtEvery];
          campSitesInRange(stop, stops);
        }
      }
    }
  });
}

function addMarkerAt(campSite) {
  var marker = new google.maps.Marker({
    position: campSite.location,
    map: map,
    title: 'DEBUG'
  });
  markers.push(marker);
}

function addTentMarkerAt(campSite) {
  var tentIcon = 'img/tent-marker.png';
  var marker = new google.maps.Marker({
    position: campSite.location,
    map: map,
    icon: tentIcon
  });

  google.maps.event.addListener(marker, 'click', function(e) {
    map.setZoom(4);
    map.setCenter(marker.getPosition());
  });

  google.maps.event.addListener(marker, 'mouseover', function(e) {

    var point = overlay.getProjection().fromLatLngToDivPixel(e.latLng);

    var mapLeft = point.x;
    var mapTop = point.y;

    var infoDiv = $("#info");
    var smartTag = $("#smart-tag");
    var mapPos = $("#map-canvas").offset();

    mapLeft = mapPos.left + mapLeft;
    mapTop = mapPos.top + mapTop;

    infoDiv.html(buildInfo(campSite));
    smartTag.text(campSite.name);

    smartTag.css({top: mapTop, left: mapLeft, position:'absolute'});
  });

//  google.maps.event.addListener(marker, 'mouseout', function() {
//    var infoDiv = $("#info");
//    infoDiv.text("");
//  });

  markers.push(marker);
}

function buildInfo(campSite) {
  var output = "<h4 class='info-header'>Camp Site Info</h4>";
  output = output + "<table class='info-table'>"
  for (key in campSite) {
    output = output + "<tr>"
    output = output + "<td><span class='property-name'>" + key + ":</span></td>";
    output = output + "<td><span class='property-value'>" + campSite[key] + "</span></td>";
    output = output + "</tr>"
  }
  return output;
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
  calcRoute(false);
};

function distanceBetween(pointA, pointB) {
  var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);
  var distanceInMiles = Math.round(distanceBetween * .000621371);
  // console.log("distance between " + pointA + " and " + pointB + " is " + distanceInMiles + " miles.");
  return distanceInMiles;
}

function campSitesInRange(latlong, stops) {
  var campingOptions = [];
  for (var i=0; i < campSites.length; i++) {
    var distance = distanceBetween(campSites[i].location, latlong);
    // console.log(distance);
    if (!isNaN(distance) && distance <= maxMiles) {
      addTentMarkerAt(campSites[i]);
      campingOptions.push(campSites[i]);
    }
  }
  var alreadyBuilt = $("#stops").children("select").length;
  if (alreadyBuilt < stops) {
    var stopDiv = '<select multiple="multiple" onchange="updatewaypoints();" class=" select select-waypoint" id="' + latlong + '">';
    for (var i = 0; i < campingOptions.length; i++) {
      stopDiv += '<option value="' + campingOptions[i].location + '">' + campingOptions[i].name + '</option>';
    }
    stopDiv += '</select>';
    $("#stops").append(stopDiv);
  }
}
