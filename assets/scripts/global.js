/* ---------------------------------------------------------------------
Global JavaScript & jQuery

Target Browsers: All
Authors: Konr Ness
------------------------------------------------------------------------ */

var SS = SS || {};

(function($){

    $(function() {

        SS.init();

    });

}(jQuery));

/**
 * a* = actual values
 * s* = scale values
 *
 * Actual:
 * diameter (m)
 * distance (km)
 *
 * Scale:
 * diameter (m)
 * distance (km)
 */
SS.bodies = {};
SS.bodies.SUN     = {id : "sun",     adiameter : 1392000000, adistance : 0,          sdiameter : 1, sdistance : 1, color : "#dab226", diameterSelector : "#sun-diameter"    , distanceSelector : "#sun-distance"};
SS.bodies.MERCURY = {id : "mercury", adiameter : 4880000,    adistance : 58000000,   sdiameter : 1, sdistance : 1, color : "#7d5e13", diameterSelector : "#mercury-diameter", distanceSelector : "#mercury-distance"};
SS.bodies.VENUS   = {id : "venus",   adiameter : 12104000,   adistance : 108000000,  sdiameter : 1, sdistance : 1, color : "#da5915", diameterSelector : "#venus-diameter"  , distanceSelector : "#venus-distance"};
SS.bodies.EARTH   = {id : "earth",   adiameter : 12756000,   adistance : 150000000,  sdiameter : 1, sdistance : 1, color : "#4813a4", diameterSelector : "#earth-diameter"  , distanceSelector : "#earth-distance"};
SS.bodies.MOON    = {id : "moon",    adiameter : 3476000,    adistance : 150000000,  sdiameter : 1, sdistance : 1, color : "",        diameterSelector : "#moon-diameter"   , distanceSelector : "#moon-distance"};
SS.bodies.MARS    = {id : "mars",    adiameter : 6794000,    adistance : 227000000,  sdiameter : 1, sdistance : 1, color : "#475938", diameterSelector : "#mars-diameter"   , distanceSelector : "#mars-distance"};
SS.bodies.JUPITER = {id : "jupiter", adiameter : 142984000,  adistance : 779000000,  sdiameter : 1, sdistance : 1, color : "#095a57", diameterSelector : "#jupiter-diameter", distanceSelector : "#jupiter-distance"};
SS.bodies.SATURN  = {id : "saturn",  adiameter : 120536000,  adistance : 1428000000, sdiameter : 1, sdistance : 1, color : "#922e15", diameterSelector : "#saturn-diameter" , distanceSelector : "#saturn-distance"};
SS.bodies.URANUS  = {id : "uranus",  adiameter : 51118000,   adistance : 2974000000, sdiameter : 1, sdistance : 1, color : "#246013", diameterSelector : "#uranus-diameter" , distanceSelector : "#uranus-distance"};
SS.bodies.NEPTUNE = {id : "neptune", adiameter : 49532000,   adistance : 4506000000, sdiameter : 1, sdistance : 1, color : "#343692", diameterSelector : "#neptune-diameter", distanceSelector : "#neptune-distance"};
SS.bodies.PLUTO   = {id : "pluto",   adiameter : 2300000,    adistance : 5913000000, sdiameter : 1, sdistance : 1, color : "#8e431c", diameterSelector : "#pluto-diameter"  , distanceSelector : "#pluto-distance"};

/**
 * 1:        sun to pluto = 5.914 Tm
 * 20000000: sun to pluto = 300km
 * 1000000000: sun to pluto = 5.9km
 */
SS.Scale = 0;

SS.init = function() {
    $('#units input').change(SS.unitChange);

    for (key in SS.bodies) {
        SS.bodies[key].diameterElement = $(SS.bodies[key].diameterSelector);
        SS.bodies[key].distanceElement = $(SS.bodies[key].distanceSelector);

        SS.bodies[key].diameterElement.css('border-color', SS.bodies[key].color);
        SS.bodies[key].distanceElement.css('border-color', SS.bodies[key].color);
    }

    SS.sunLatitude  = $('#sun-latitude');
    SS.sunLongitude = $('#sun-longitude');

    SS.bodies.SUN.diameterElement.change(SS.sunChange);

    SS.map.init();

    SS.sunChange();

};

SS.updateScale = function() {

    // calculate scale
    SS.Scale = SS.bodies.SUN.adiameter / SS.bodies.SUN.sdiameter;

    for (key in SS.bodies) {

        // everything is based on the sun's scale, so no need to update
//        if (body === SS.bodies.SUN) {
//            continue;
//        }

        // update diameters, rounded to 1000's place
        SS.bodies[key].sdiameter = Math.round(SS.bodies[key].adiameter / SS.Scale * 1000) / 1000;

        // updates distances, rounded to 1000's place
        SS.bodies[key].sdistance = Math.round(SS.bodies[key].adistance / SS.Scale * 1000) / 1000;

        // update forms
        SS.bodies[key].diameterElement.val(SS.bodies[key].sdiameter);
        SS.bodies[key].distanceElement.val(SS.bodies[key].sdistance);
    }

    SS.map.update();

};

SS.unitChange = function() {

    SS.updateScale();

};

SS.sunChange = function() {

    SS.bodies.SUN.sdiameter = SS.bodies.SUN.diameterElement.val();

    SS.updateScale();
};

SS.map = {};

SS.map.init = function() {

    SS.map.center = new google.maps.LatLng(44.97027735, -93.28905);

    SS.map.map = new google.maps.Map(
        document.getElementById('map_canvas'),
        {
            center : SS.map.center,
            zoom   : 11,
            mapTypeId : google.maps.MapTypeId.ROADMAP
        }
    );

    // add sun marker
    SS.map.sunMarker = new google.maps.Marker({
        position: SS.map.center,
        map       : SS.map.map,
        title     : 'Sun',
        draggable : true,
// @todo Can't get the sun map marker to actually be centered on the map. And it obscures the inner planets.
//        icon      : "http://www.buildforliving.com/clipart/bullets/sunFlower_large.gif",
//        flat      : true,
//        raiseOnDrag : false,
//        shape     : { type : 'circle', coords : [12.5, 12.5, 12.5] }
    });

    google.maps.event.addListener(SS.map.sunMarker, 'dragend', SS.map.sunPositionChange);

    // call it immediately to update form fields
    SS.map.sunPositionChange();

};

SS.map.sunPositionChange = function() {
    SS.map.center = SS.map.sunMarker.getPosition();
    SS.map.map.panTo(SS.map.center);

    SS.sunLatitude.val(Math.round(SS.map.center.lat() * 10000) / 10000);
    SS.sunLongitude.val(Math.round(SS.map.center.lng() * 10000) / 10000);

    SS.map.update();
};

SS.map.update = function() {

    SS.map.circles = SS.map.circles || {};

    for (key in SS.bodies) {

        // remove the circle from the map
        if (typeof SS.map.circles[SS.bodies[key].id] !== 'undefined') {
            SS.map.circles[SS.bodies[key].id].setMap(null);
            SS.map.circles[SS.bodies[key].id] = null;
        }

        var circleOptions = {
            strokeColor   :SS.bodies[key].color,
            strokeOpacity : 0.8,
            strokeWeight  : 2,
            fillColor     : '#000000',
            fillOpacity   : 0,
            map           : SS.map.map,
            radius        : SS.bodies[key].sdistance * 1000, // to meters
            center        : SS.map.center,
            clickable     : true
        };

        // add the circle to the map
        SS.map.circles[SS.bodies[key].id] = new google.maps.Circle(circleOptions);

    }

    // pan/zoom the map to fit the largest circle
    // this doesn't work well because if the map is zoomed way in, it does not zoom out to cover the entire solar system
    // @see https://developers.google.com/maps/documentation/javascript/reference#Map
    // SS.map.map.panToBounds(SS.map.circles[SS.bodies[key].id].getBounds());

};
