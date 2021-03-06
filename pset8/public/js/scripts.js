/**
 * scripts.js
 *
 * Computer Science 50
 * Problem Set 8
 *
 * Global JavaScript.
 */

// Google Map
var map;

// markers for map
var markers = [];

// info window
var info = new google.maps.InfoWindow();

// execute when the DOM is fully loaded
$(function() {

    // styles for map
    // https://developers.google.com/maps/documentation/javascript/styling
    var styles = [

        // hide Google's labels
        {
            featureType: "all",
            elementType: "labels",
            stylers: [
                {visibility: "off"}
            ]
        },

        // hide roads
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [
                {visibility: "off"}
            ]
        }

    ];

    // options for map
    // https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var options = {
        center: {lat: 42.3770, lng: -71.1256}, // Cambridge, Massachusetts
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 14,
        panControl: true,
        styles: styles,
        zoom: 13,
        zoomControl: true
    };

    // get DOM node in which map will be instantiated
    var canvas = $("#map-canvas").get(0);

    // instantiate map
    map = new google.maps.Map(canvas, options);

    // configure UI once Google Map is idle (i.e., loaded)
    google.maps.event.addListenerOnce(map, "idle", configure);

});

/**
 * Adds marker for place to map.
 */
function addMarker(place)
{
    //https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple
    // This example displays a marker at the center of Australia.
// When the user clicks the marker, an info window opens.
//  var contentString = '<div id="content">'+
//      '<div id="siteNotice">'+
//      '</div>'+
//      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
//      '<div id="bodyContent">'+
//      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
//      'sandstone rock formation in the southern part of the '+
//      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
//      'south west of the nearest large town, Alice Springs; 450&#160;km '+
//      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
//      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
//      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
//      'Aboriginal people of the area. It has many springs, waterholes, '+
//      'rock caves and ancient paintings. Uluru is listed as a World '+
//      'Heritage Site.</p>'+
//      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
//      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
//      '(last visited June 22, 2009).</p>'+
//      '</div>'+
//      '</div>';
//
//// $.getJSON("update.php", parameters)
//    .done(function(data, textStatus, jqXHR) {

//        // remove old markers from map
//        removeMarkers();

//        // add new markers to map
//        for (var i = 0; i < data.length; i++)
//        {
//            addMarker(data[i]);
//        }
//     })
//     .fail(function(jqXHR, textStatus, errorThrown) {

//         // log error to browser's console
//         console.log(errorThrown.toString());
//
//
//
//
//  var infowindow = new google.maps.InfoWindow({
//    content: contentString
//  });
   var latitude = parseFloat(place["latitude"]);
   var longitude = parseFloat(place["longitude"]);
   var coor = {lat: latitude, lng: longitude};
   var titlos = String(place["place_name"]+" , "+place["admin_name1"]);
   var marker = new MarkerWithLabel({
    position: coor,
    map: map,
    labelContent: titlos
    });
 var list;
  markers.push(marker);
 
 var parameters = { geo: place.postal_code };
 $.getJSON("articles.php", parameters)
    .done(function(data, textStatus, jqXHR) {
    list = "<div id='ls';> <ul>";
        // add new markers to map
        for (var i = 0; i < data.length; i++)
        {
            list += "<li> <a href=\"" + data[i].link + "\">" + data[i].title + "</li>";
        }
        list += "</ul> </div>";
     //list = "Wow it works!";
     //list = data.length;
     })
     .fail(function(jqXHR, textStatus, errorThrown) {
    
     list = "Slow news day!";
     })   
       
  marker.addListener('click', function() {
    showInfo(marker, list);
  });
}








/**
 * Configures application.
 */
function configure()
{
    // update UI after map has been dragged
    google.maps.event.addListener(map, "dragend", function() {
        update();
    });

    // update UI after zoom level changes
    google.maps.event.addListener(map, "zoom_changed", function() {
        update();
    });

    // remove markers whilst dragging
    google.maps.event.addListener(map, "dragstart", function() {
        removeMarkers();
    });

    // configure typeahead
    // https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md
    $("#q").typeahead({
        autoselect: true,
        highlight: false,
        minLength: 1
    },
    {
        source: search,
        templates: {
            empty: "no places found yet",
            suggestion: _.template("<p><%- place_name %>, <%- admin_name1 %> <b><%- postal_code %></b></p>")
        }
    });

    // re-center map after place is selected from drop-down
    $("#q").on("typeahead:selected", function(eventObject, suggestion, name) {

        // ensure coordinates are numbers
        var latitude = (_.isNumber(suggestion.latitude)) ? suggestion.latitude : parseFloat(suggestion.latitude);
        var longitude = (_.isNumber(suggestion.longitude)) ? suggestion.longitude : parseFloat(suggestion.longitude);

        // set map's center
        map.setCenter({lat: latitude, lng: longitude});

        // update UI
        update();
    });

    // hide info window when text box has focus
    $("#q").focus(function(eventData) {
        hideInfo();
    });

    // re-enable ctrl- and right-clicking (and thus Inspect Element) on Google Map
    // https://chrome.google.com/webstore/detail/allow-right-click/hompjdfbfmmmgflfjdlnkohcplmboaeo?hl=en
    document.addEventListener("contextmenu", function(event) {
        event.returnValue = true; 
        event.stopPropagation && event.stopPropagation(); 
        event.cancelBubble && event.cancelBubble();
    }, true);

    // update UI
    update();

    // give focus to text box
    $("#q").focus();
}

/**
 * Hides info window.
 */
function hideInfo()
{
    info.close();
}

/**
 * Removes markers from map.
 */
function removeMarkers()
{
     for (var i = 0; i < markers.length; i++) 
     {
        markers[i].setMap(null);
     }   
     markers = [];
    
}

/**
 * Searches database for typeahead's suggestions.
 */
function search(query, cb)
{
    // get places matching query (asynchronously)
    var parameters = {
        geo: query
    };
    $.getJSON("search.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // call typeahead's callback with search results (i.e., places)
        cb(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());
    });
}

/**
 * Shows info window at marker with content.
 */
function showInfo(marker, content)
{
    // start div
    var div = "<div id='info'>";
    if (typeof(content) === "undefined")
    {
        // http://www.ajaxload.info/
        div += "<img alt='loading' src='img/ajax-loader.gif'/>";
    }
    else
    {
        div += content;
    }

    // end div
    div += "</div>";

    // set info window's content
    info.setContent(div);

    // open info window (if not already open)
    info.open(map, marker);
}

/**
 * Updates UI's markers.
 */
function update() 
{
    // get map's bounds
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    // get places within bounds (asynchronously)
    var parameters = {
        ne: ne.lat() + "," + ne.lng(),
        q: $("#q").val(),
        sw: sw.lat() + "," + sw.lng()
    };
    $.getJSON("update.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // remove old markers from map
        removeMarkers();

        // add new markers to map
        for (var i = 0; i < data.length; i++)
        {
            addMarker(data[i]);
        }
     })
     .fail(function(jqXHR, textStatus, errorThrown) {

         // log error to browser's console
         console.log(errorThrown.toString());
     });
};
