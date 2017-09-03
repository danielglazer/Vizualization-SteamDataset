'use strict';

// remove this if you use Modernizr 
(function (e, t, n) {
    var r = e.querySelectorAll("html")[0];
    r.className = r.className.replace(/(^|\s)no-js(\s|$)/, "$1js$2")
})(document, window, 0);

//  handler for listeners 
var Handler = (function () {
    var i = 1,
        listeners = {};

    return {
        addListener: function (element, event, handler, capture) {
            element.addEventListener(event, handler, capture);
            listeners[i] = {
                element: element,
                event: event,
                handler: handler,
                capture: capture
            };
            return i++;
        },
        removeListener: function (id) {
            if (id in listeners) {
                var h = listeners[id];
                h.element.removeEventListener(h.event, h.handler, h.capture);
                delete listeners[id];
            }
        },
        removeAllListeners: function () {
            Object.keys(listeners).forEach(function (id) {
                Handler.removeListener(id);
            });
        },
        getListeners: function () {
            return listeners;
        }
    };
}());

var fileData; // the geojson parsed to js json

// A $( document ).ready() block.
$(document).ready(function () {
    $("#menu-toggle").popover('show');
    // <!-- Menu Toggle Script -->
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        $("#menu-toggle").popover('dispose');

    });
    (function (document, window, index) {
        // feature detection for drag&drop upload
        var isAdvancedUpload = function () {
            var div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
        }();
        // applying the effect for every form
        var forms = document.querySelectorAll('.box');
        Array.prototype.forEach.call(forms, function (form) {
            var input = form.querySelector('input[type="file"]'),
                label = form.querySelector('label'),
                errorMsg = form.querySelector('.box__error span'),
                restart = form.querySelectorAll('.box__restart'),
                droppedFiles = false,
                //  showFiles = function (files) {
                //      label.textContent = files.length > 1 ? (input.getAttribute('data-multiple-caption') || '').replace('{count}', files.length) : files[0].name;
                //  },
                triggerFormSubmit = function () {
                    var event = document.createEvent('HTMLEvents');
                    event.initEvent('submit', true, false);
                    form.dispatchEvent(event);
                };
            // automatically submit the form on file select
            Handler.addListener(input, 'change', function (e) {
                //  showFiles(e.target.files);
                droppedFiles = e.target.files;
                triggerFormSubmit();
            }, false);
            // drag&drop files if the feature is available
            if (isAdvancedUpload) {
                form.classList.add('has-advanced-upload'); // letting the CSS part to know drag&drop is supported by the browser
                ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
                    Handler.addListener(form, event, function (e) {
                        // preventing the unwanted behaviours
                        e.preventDefault();
                        e.stopPropagation();
                    }, false);

                });
                ['dragover', 'dragenter'].forEach(function (event) {
                    Handler.addListener(form, event, function () {
                        form.classList.add('is-dragover');
                    }, false);

                });
                ['dragleave', 'dragend', 'drop'].forEach(function (event) {
                    Handler.addListener(form, event, function () {
                        form.classList.remove('is-dragover');
                    }, false);
                });
                Handler.addListener(form, 'drop', function (e) {
                    droppedFiles = e.dataTransfer.files; // the files that were dropped
                    //  showFiles(droppedFiles);
                    triggerFormSubmit();
                }, false);
            }
            // if the form was submitted
            Handler.addListener(form, 'submit', function (e) {
                // preventing the duplicate submissions if the current one is in progress
                if (form.classList.contains('is-uploading')) return false;

                form.classList.add('is-uploading');
                form.classList.remove('is-error');

                var reader = new FileReader();
                reader.onloadend = function () {
                    form.classList.remove('is-uploading');
                    var data = validateJSON(this.result);
                    form.classList.add(isSuccess(data) == true ? 'is-success' : 'is-error');
                    if (isSuccess(data)) {
                        console.log(data);
                        fileData = data;
                        setUpHomeScreen();
                    }
                };
                reader.readAsText(droppedFiles[0]);
                e.preventDefault();
            }, false);

            // restart the form if has a state of error/success
            Array.prototype.forEach.call(restart, function (entry) {
                Handler.addListener(entry, 'click', function (e) {
                    e.preventDefault();
                    form.classList.remove('is-error', 'is-success');
                    input.click();
                }, false);
            });
            // Firefox focus bug fix for file input
            Handler.addListener(input, 'focus', function () { input.classList.add('has-focus'); }, false);
            Handler.addListener(input, 'blur', function () { input.classList.remove('has-focus'); }, false);
        });

    }(document, window, 0));
});

function validateJSON(str) {
    try {
        var data = JSON.parse(str);
        // if came to here, then valid
        return data;
    } catch (e) {
        // failed to parse
        return null;
    }
}

function isSuccess(data) {
    if (data == null) {
        return false;
    } else if (data.type == null) {
        return false;
    } else if (data.type != "FeatureCollection") {
        return false;
    } else if (data.features == null) {
        return false;
    } else if (data.games == null) {
        return false;
    } else {
        return true;
    }
};

// 2 colors
// 2 properties property a,b "a/b" "a*b" "operator"
// "a+b/c+d"
var dictionary = {
    "game1": "DOTA2",
    "game2": "CS:GO",
    "game3": "TF2",
    "game4": "Garry's Mod",
    "game5": "Skyrim",
    "game6": "RUST",
    "game7": "Civilization V",
    "game8": "Terraria",
    "game9": "DayZ",
    "game10": "PAYDAY 2",
    "game1owners_na": "Dota 2 | Owners (not-active)",
    "game2owners_na": "Counter-Strike: Global Offensive | Owners (not-active)",
    "game3owners_na": "Team Fortress 2 | Owners (not-active)",
    "game4owners_na": "Garry's Mod | Owners (not-active)",
    "game5owners_na": "Skyrim | Owners (not-active)",
    "game6owners_na": "Rust | Owners (not-active)",
    "game7owners_na": "Sid Meier\'s Civilization® V | Owners (not-active)",
    "game8owners_na": "Terraria | Owners (not-active)",
    "game9owners_na": "DayZ | Owners (not-active)",
    "game10owners_na": "PAYDAY 2 | Owners (not-active)",
    "all_num_active": "Active players worldwide", //from the current dataset
    "all_num_owners": "Game owners worldwide", //from the current dataset
    "avg_play_time": "Average playtime worldwide",
    "continent": "Continent",
    "country_active": "Active players in country", //from the initial dataset 
    "country_owners": "Game owners in country", //from the initial dataset
    "economy": "Economy Group",
    "game1active_users": "Dota 2 | Active gamers",
    "game1avg_play_time": "Dota 2 | Playtime in 2 weeks",
    "game1casual_users": "Dota 2 | Casual gamers ",
    "game1excessive_users": "Dota 2 | Excessive gamers ",
    "game1moderate_users": "Dota 2 | Moderate gamers",
    "game1owners": "Dota 2 | Owners",
    "game2active_users": "Counter-Strike: Global Offensive | Active gamers",
    "game2avg_play_time": "Counter-Strike: Global Offensive | Playtime in 2 weeks",
    "game2casual_users": "Counter-Strike: Global Offensive | Casual gamers ",
    "game2excessive_users": "Counter-Strike: Global Offensive | Excessive gamers ",
    "game2moderate_users": "Counter-Strike: Global Offensive | Moderate gamers",
    "game2owners": "Counter-Strike: Global Offensive | Owners",
    "game3active_users": "Team Fortress 2 | Active gamers",
    "game3avg_play_time": "Team Fortress 2 | Playtime in 2 weeks",
    "game3casual_users": "Team Fortress 2 | Casual gamers ",
    "game3excessive_users": "Team Fortress 2 | Excessive gamers ",
    "game3moderate_users": "Team Fortress 2 | Moderate gamers",
    "game3owners": "Team Fortress 2 | Owners",
    "game4active_users": "Garry's Mod | Active gamers",
    "game4avg_play_time": "Garry's Mod | Playtime in 2 weeks",
    "game4casual_users": "Garry's Mod | Casual gamers ",
    "game4excessive_users": "Garry's Mod | Excessive gamers ",
    "game4moderate_users": "Garry's Mod | Moderate gamers",
    "game4owners": "Garry's Mod | Owners",
    "game5active_users": "Skyrim | Active gamers",
    "game5avg_play_time": "Skyrim | Playtime in 2 weeks",
    "game5casual_users": "Skyrim | Casual gamers ",
    "game5excessive_users": "Skyrim | Excessive gamers ",
    "game5moderate_users": "Skyrim | Moderate gamers",
    "game5owners": "Skyrim | Owners",
    "game6active_users": "Rust | Active gamers",
    "game6avg_play_time": "Rust | Playtime in 2 weeks",
    "game6casual_users": "Rust | Casual gamers ",
    "game6excessive_users": "Rust | Excessive gamers ",
    "game6moderate_users": "Rust | Moderate gamers",
    "game6owners": "Rust | Owners",
    "game7active_users": "Sid Meier\'s Civilization® V | Active gamers",
    "game7avg_play_time": "Sid Meier\'s Civilization® V | Playtime in 2 weeks",
    "game7casual_users": "Sid Meier\'s Civilization® V | Casual gamers ",
    "game7excessive_users": "Sid Meier\'s Civilization® V | Excessive gamers ",
    "game7moderate_users": "Sid Meier\'s Civilization® V | Moderate gamers",
    "game7owners": "Sid Meier\'s Civilization® V | Owners",
    "game8active_users": "Terraria | Active gamers",
    "game8avg_play_time": "Terraria | Playtime in 2 weeks",
    "game8casual_users": "Terraria | Casual gamers ",
    "game8excessive_users": "Terraria | Excessive gamers ",
    "game8moderate_users": "Terraria | Moderate gamers",
    "game8owners": "Terraria | Owners",
    "game9active_users": "DayZ | Active gamers",
    "game9avg_play_time | Playtime in 2 weeks": "DayZ",
    "game9casual_users": "DayZ | Casual gamers ",
    "game9excessive_users": "DayZ | Excessive gamers ",
    "game9moderate_users": "DayZ | Moderate gamers",
    "game9owners": "DayZ | Owners",
    "game10active_users": "PAYDAY 2 | Active gamers",
    "game10avg_play_time": "PAYDAY 2 | Playtime in 2 weeks",
    "game10casual_users": "PAYDAY 2 | Casual gamers ",
    "game10excessive_users": "PAYDAY 2 | Excessive gamers ",
    "game10moderate_users": "PAYDAY 2 | Moderate gamers",
    "game10owners": "PAYDAY 2 | Owners",
    "gdp_md_est": "GDP",
    "income_grp": "Country's Income Group",
    "iso_a2": "2-letter country code",
    "iso_a3": "3-letter country code",
    "money_spent": "Money spent for buying games",
    "name": "Country Name",
    "name_long": "Country long Name",
    "num_casual_users": "Casual gamers (all games)",
    "num_excessive_users": "Excessive gamers (all games)",
    "num_moderate_users": "Moderate gamers (all games)",
    "pop_est": "Population",
    "subregion": "Geographical Subregion"
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function numberAsPercent(x) {
    return "" + (Math.round(x * 1000)) / 10 + "%";
}

function getTime2w(minutes) {
    var min = minutes / 14; // min per day
    var remainder = ((Math.floor((min % 60) / 10)) ? '' : '0') + Math.floor(min % 60);
    return Math.floor(min / 60) + " : " + remainder;
}

function transposeArray(array) {
    var newArray = array[0].map(function (col, i) {
        return array.map(function (row) {
            return row[i]
        })
    });

    return newArray;
}

function setUpHomeScreen() {
    // first set up the screen and hide the DNDbox 
    $("#DND").fadeOut("slow");
    $(".sidebar-nav").removeClass("invisible");
    //also remove all it's eventListeners
    Handler.removeAllListeners();
    //craete the nav bar Listeners
    createNavbarListeners();
    //  var btnGroup = $("nav").append("<div class='btn-group-vertical' role='group'></div>");

    //  btnGroup.append(createButton("button", "info1", "btn btn-info onTop", tempFunc));
    // btnGroup.append(createButton("button", "info", "btn btn-info onTop col align-self-center", tempFunc));

    // <button type="button" class="btn btn-primary">Primary</button>
    //add button listener via Handler

    //then show a navbar to the user where the DNDbox was placed instead

    //accordung to the subject that was clicked change View

    // according to the view visualize the data
}

function createNavbarListeners() {
    //Games
    Handler.addListener($("#Games_Choropleth")[0], "click", gamesChoropleth, false);
    Handler.addListener($("#Games_RadialAxis")[0], "click", gamesRadialAxis, false);
    Handler.addListener($("#Games_BarChart")[0], "click", gamesBarChart, false);
    Handler.addListener($("#Games_StackedBarChart")[0], "click", gamesStackedBarChart, false);
    //Economy
    Handler.addListener($("#Economy_LineGraphs")[0], "click", economyLineGraphs, false);
    Handler.addListener($("#Economy_RadialAxis")[0], "click", economyRadialAxis, false);
    Handler.addListener($("#Economy_ParallelCoordinates")[0], "click", economyParallelCoordinates, false);
    //Countries
    Handler.addListener($("#Countries_BarChart")[0], "click", countriesBarChart, false);
    Handler.addListener($("#Countries_StackedBarChart")[0], "click", countriesStackedBarChart, false);
    //Continents
    Handler.addListener($("#Continents_Choropleth")[0], "click", continentsChoropleth, false);
    Handler.addListener($("#Continents_RadialAxis")[0], "click", continentsRadialAxis, false);
    //About
    Handler.addListener($("#About")[0], "click", about, false);
};

// "Games"' Listeners Handler functions
function gamesChoropleth() {
    stopHandlers();
    ChoroplethHandler.startBC({ "type": "games", "properties": ["game1owners"] });
}
function gamesRadialAxis() {
    stopHandlers();
    RadialAxisHandler.start({ "type": "games" });
}
function gamesBarChart() {
    stopHandlers();
    BarchartHandler.startBC({ "type": "games", "properties": ["owners"] });
}
function gamesStackedBarChart() {
    stopHandlers();
    StackedBarchartHandler.startSBC({ "type": "games", "properties": ["addiction_cat"] })
}
// "Economy"'s Listeners Handler functions
function economyLineGraphs() {
    stopHandlers();
    LineGraphHandler.startSBC({ "type": "economy", "properties": ["economy"] })
}
function economyRadialAxis() {
    stopHandlers();
    RadialAxisHandler.start({ "type": "economy" });
}
function economyParallelCoordinates() {
    stopHandlers();
    ParallelCoordinateHandler.start({ "type": "economy", "properties": [] });
}
// "Countries"' Listeners Handler functions
function countriesBarChart() {
    stopHandlers();
    BarchartHandler.startBC({ "type": "countries", "properties": ["game1owners"] });
}
function countriesStackedBarChart() {
    stopHandlers();
    StackedBarchartHandler.startSBC({ "type": "countries", "properties": ["addiction_cat", "1"] });
}
// "Continents"' Listeners Handler functions
function continentsChoropleth() {
    stopHandlers();
    ChoroplethHandler.startBC({ "type": "continents", "properties": ["continent", "game1owners"] });
}
function continentsRadialAxis() {
    stopHandlers();
    RadialAxisHandler.start({ "type": "continents" });
}
// "About"'s Listener Handler function
function about() {
    console.log(this);
}
function stopHandlers() {
    BarchartHandler.stopBC();
    StackedBarchartHandler.stopSBC();
    ChoroplethHandler.stopBC();
    ParallelCoordinateHandler.stop();
    RadialAxisHandler.stop();
    LineGraphHandler.stopSBC();
}

/**
* create a Clickable element with the specified id and classes 
 * and attach an onClick listener with the parameter function  
 * @param {String} type
 * @param {String} id 
 * @param {String} classes 
 * @param {Function} onClickFunction 
 * @returns 
 * @returns 
 */
function createClickable(type, id, classes, onClickFunction) {
    var btn = $('<' + type + '/>', {
        text: id, //set text 1 to 10
        id: id,
        click: onClickFunction
    });
    btn.a
    return btn;
};

var currentProperty = "pop_est"; // pop_est/money_spent // if(division) -> split(/)  
// linked list / object / array of parameters
var currentMode = ""; // "enum" 1. rawdata 2. division 3. category
function pickForCurrentProperty(d) {
    return d.properties[currentProperty];
}


var ChoroplethHandler = (function () {
    var type;
    var propertyParams;
    var map;
    var ctrlHTMLElem;
    var chartData = new Array();
    var groupedData = new Array();
    var color; // color function
    var groupedColors;
    var baseColors;
    var info; // info element
    var legend; // legend element
    var controls;
    var geojson;
    var groupedGeojson;
    return {
        // resets chartData, containing array/s with the data specifically for the current barchart parameters
        resetChartData: function () {
            if (type == "continents") {
                var propertyName = propertyParams[0];
                groupedData = d3.nest()
                    .key(function (d) { return d.properties[propertyName]; })
                    .entries(fileData.features);
                groupedData.sort(function (a, b) {
                    var keyA = a.key.toUpperCase(); // ignore upper and lowercase
                    var keyB = b.key.toUpperCase(); // ignore upper and lowercase
                    if (keyA < keyB) {
                        return -1;
                    }
                    if (keyA > keyB) {
                        return 1;
                    }
                    // names must be equal
                    return 0;
                })
                ChoroplethHandler.resetGroupedColor();
            }
            chartData = Object.assign({}, fileData); // deep copy
        },
        resetGroupedColor: function () {
            groupedColors = new Array();
            baseColors = d3.scaleOrdinal(d3.schemeCategory10);
            for (var i = 0; i < groupedData.length; i++) {
                var domain = [0, d3.max(groupedData[i].values, function (d) {
                    return ChoroplethHandler.getProperties(d);
                })];
                groupedColors[i] = d3.scaleLinear().domain(domain)
                    .interpolate(d3.interpolateRgb)
                    .range([d3.rgb("white"), baseColors(i)]);
            }
        },
        getData: function () {
            return chartData;
        },
        getProperties: function (d) {
            var ret;
            if (type == "continents") {
                if (propertyParams.length == 3) {
                    var dividend = d.properties[propertyParams[1]];
                    var divisor = d.properties[propertyParams[2]];
                    ret = (divisor == 0) ? (0) : (dividend / divisor);
                }
                else {
                    ret = d.properties[propertyParams[1]];
                }
            } else {
                if (propertyParams.length == 2) {
                    var dividend = d.properties[propertyParams[0]];
                    var divisor = d.properties[propertyParams[1]];
                    ret = (divisor == 0) ? (0) : (dividend / divisor);
                }
                else {
                    ret = d.properties[propertyParams[0]];
                }
            }
            return ret;
        },
        draw: function () {
            ChoroplethHandler.show();

            map.createPane('labels');
            map.getPane('labels').style.zIndex = 650;
            map.getPane('labels').style.pointerEvents = 'none';

            var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
                attribution: '©OpenStreetMap, ©CartoDB'
            }).addTo(map);

            var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
                attribution: '©OpenStreetMap, ©CartoDB',
                pane: 'labels'
            }).addTo(map);

            ChoroplethHandler.regenColor();
            info = L.control();

            ChoroplethHandler.attachLayers();

            // fit to the bounds of the geojson
            map.fitBounds(geojson.getBounds());
            // dont allow user to pan out of the world map view
            var southWest = L.latLng(-89.98155760646617, -180),
                northEast = L.latLng(89.99346179538875, 180);
            var bounds = L.latLngBounds(southWest, northEast);
            map.setMaxBounds(bounds);
            map.on('drag', function () {
                map.panInsideBounds(bounds, { animate: false });
            });
            map.setMinZoom(2);
            map.setMaxZoom(6);
        },
        attachLayers: function () {
            if (type == "continents") {
                groupedGeojson = new Array();
                for (var i = 0; i < groupedData.length; i++) {
                    // geojson binding
                    groupedGeojson[i] = L.geoJson(groupedData[i].values, {
                        style: ChoroplethHandler.groupedStyle,
                        onEachFeature: ChoroplethHandler.onEachFeature
                    }).addTo(map);
                    // pop-up dialog
                    groupedGeojson[i].eachLayer(function (layer) {
                        layer.bindPopup(layer.feature.properties.name);
                    });
                    geojson = groupedGeojson[i];
                }
            } else {
                geojson = L.geoJson(chartData, {
                    style: ChoroplethHandler.style,
                    onEachFeature: ChoroplethHandler.onEachFeature
                }).addTo(map);
                // pop-up dialog
                geojson.eachLayer(function (layer) {
                    layer.bindPopup(layer.feature.properties.name);
                });
            }
        },
        redraw: function () {
            map.removeLayer(geojson);
            if (groupedGeojson != null) {
                for (var i = 0; i < groupedGeojson.length; i++) {
                    map.removeLayer(groupedGeojson[i]);
                }
            }
            ChoroplethHandler.attachLayers();
            // geojson = L.geoJson(ChoroplethHandler.getData(), {
            //     style: ChoroplethHandler.style,
            //     onEachFeature: ChoroplethHandler.onEachFeature
            // }).addTo(map);
        },
        updateMap: function () {
            ChoroplethHandler.resetChartData();
            ChoroplethHandler.regenColor();
            info.update();
            legend.update();
            ChoroplethHandler.redraw();
            // geojson.eachLayer(function (layer) {
            //     geojson.resetStyle(layer);
            // });
            if (type == "continents") {

            }
        },
        regenColor: function (color1, color2) {
            if (!color1) {
                color1 = "#f7fbff";
            }
            if (!color2) {
                color2 = '#08306b';
            }
            var domain;
            if (propertyParams.length == 2) {
                domain = [0, 1];
            }
            else {
                domain = [0, d3.max(chartData.features, function (d) {
                    return ChoroplethHandler.getProperties(d);
                })];
            }
            color = d3.scaleLinear().domain(domain)
                .interpolate(d3.interpolateRgb)
                .range([d3.rgb(color1), d3.rgb(color2)]);
        },
        style: function (feature) {
            return {
                fillColor: color([ChoroplethHandler.getProperties(feature)]),
                weight: 2,
                opacity: 1,
                color: 'black',
                dashArray: '3',
                fillOpacity: 1
            };

        },
        groupedStyle: function (feature) {
            var property = feature.properties[propertyParams[0]];
            var i = groupedData.findIndex(function (element) { return element.key == property });
            return {
                fillColor: groupedColors[i]([ChoroplethHandler.getProperties(feature)]),
                weight: 3,
                opacity: 1,
                color: baseColors(i),
                dashArray: '1',
                fillOpacity: 1
            }
        },
        infoInit: function () {
            info.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
                this.update();
                return this._div;
            };

            // method that we will use to update the control based on feature properties passed
            info.update = function (feature) {
                if (type == "continents") {
                    if (feature != null) {
                        var property = feature.properties[propertyParams[0]];
                        var i = groupedData.findIndex(function (element) { return element.key == property });
                        if (propertyParams.length == 3) {
                            this._div.innerHTML = (feature ?
                                '<i>' + property + '</i><br />' +
                                '<b>' + feature.properties.name + '</b><br />' +
                                '<b>' + "Active Players / Owners" + '</b><br />' +
                                '<svg width="10" height="10"><rect width="10" height="10"style="fill:' + groupedColors[i]([ChoroplethHandler.getProperties(feature)]) + ';stroke-width:1;stroke:rgb(0,0,0)"/></svg> ' +
                                ((numberAsPercent(ChoroplethHandler.getProperties(feature)))) + '<br />'
                                : 'Hover over a country </br>' +
                                '<b>' + "Active Players / Owners" + '</b><br />');

                        }
                        else {

                            if (propertyParams[1].includes("avg_play_time")) {
                                this._div.innerHTML = (feature ?
                                    '<i>' + property + '</i><br />' +
                                    '<b>' + feature.properties.name + '</b><br />' +
                                    '<b>' + dictionary[propertyParams[1]] + '</b><br />' +
                                    '<svg width="10" height="10"><rect width="10" height="10"style="fill:' + groupedColors[i]([ChoroplethHandler.getProperties(feature)]) + ';stroke-width:1;stroke:rgb(0,0,0)"/></svg> ' +
                                    ((getTime2w(ChoroplethHandler.getProperties(feature)))) + '<br />'
                                    : 'Hover over a country </br>' +
                                    '<b>' + dictionary[propertyParams[1]] + '</b><br />');
                            } else {
                                this._div.innerHTML = (feature ?
                                    '<i>' + property + '</i><br />' +
                                    '<b>' + feature.properties.name + '</b><br />' +
                                    '<b>' + dictionary[propertyParams[1]] + '</b><br />' +
                                    '<svg width="10" height="10"><rect width="10" height="10"style="fill:' + groupedColors[i]([ChoroplethHandler.getProperties(feature)]) + ';stroke-width:1;stroke:rgb(0,0,0)"/></svg> ' +
                                    ((numberWithCommas(ChoroplethHandler.getProperties(feature)))) + '<br />'
                                    : 'Hover over a country </br>' +
                                    '<b>' + dictionary[propertyParams[1]] + '</b><br />');
                            }
                        }
                    }
                } else {
                    if (propertyParams.length == 2) {
                        this._div.innerHTML = (feature ?
                            '<b>' + feature.properties.name + '</b><br />' +
                            '<b>' + "Active Players / Owners" + '</b><br />' +
                            '<svg width="10" height="10"><rect width="10" height="10"style="fill:' + color(ChoroplethHandler.getProperties(feature)) + ';stroke-width:1;stroke:rgb(0,0,0)"/></svg> ' +
                            ((numberAsPercent(ChoroplethHandler.getProperties(feature)))) + '<br />'
                            : 'Hover over a country </br>' +
                            '<b>' + "Active Players / Owners" + '</b><br />');
                    }
                    else {
                        if (propertyParams[0].includes("avg_play_time")) {
                            this._div.innerHTML = (feature ?
                                '<b>' + feature.properties.name + '</b><br />' +
                                '<b>' + (dictionary[propertyParams[0]]) + '</b><br />' +
                                '<svg width="10" height="10"><rect width="10" height="10"style="fill:' + color(ChoroplethHandler.getProperties(feature)) + ';stroke-width:1;stroke:rgb(0,0,0)"/></svg> ' +
                                ((getTime2w(ChoroplethHandler.getProperties(feature)))) + '<br />'
                                : 'Hover over a country </br>' +
                                '<b>' + dictionary[propertyParams[0]] + '</b><br />');
                        } else {
                            this._div.innerHTML = (feature ?
                                '<b>' + feature.properties.name + '</b><br />' +
                                '<b>' + (dictionary[propertyParams[0]]) + '</b><br />' +
                                '<svg width="10" height="10"><rect width="10" height="10"style="fill:' + color(ChoroplethHandler.getProperties(feature)) + ';stroke-width:1;stroke:rgb(0,0,0)"/></svg> ' +
                                ((numberWithCommas(ChoroplethHandler.getProperties(feature)))) + '<br />'
                                : 'Hover over a country </br>' +
                                '<b>' + dictionary[propertyParams[0]] + '</b><br />');
                        }
                    }
                }
            };
            info.addTo(map);
        },
        highlightFeature: function (e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                opacity: 1,
                dashArray: '',
                fillOpacity: 1
            });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }

            var property = layer.feature.properties[propertyParams[0]];
            if (type == "continents") {
                for (var i = 0; i < groupedGeojson.length; i++) {
                    if (groupedData[i].key != property) {
                        groupedGeojson[i].setStyle({
                            fillColor: '#d1d5d7',
                            weight: 1,
                            opacity: 0.1,
                            color: '#ffffff',
                            dashArray: '',
                            fillOpacity: 0.1
                        });
                    }
                    else {
                        groupedGeojson[i].eachLayer(function (layer) {
                            groupedGeojson[i].resetStyle(layer);
                        });
                    }
                }
            }

            info.update(layer.feature);
        },
        // mouseout listener
        resetHighlight: function (e) {
            geojson.resetStyle(e.target);
            info.update();
        },
        // zoom on click
        zoomToFeature: function (e) {
            map.fitBounds(e.target.getBounds());
        },
        // highlighting the country, listeners assigment
        onEachFeature: function (feature, layer) {
            layer.on({
                mouseover: ChoroplethHandler.highlightFeature,
                mouseout: ChoroplethHandler.resetHighlight,
                click: ChoroplethHandler.zoomToFeature
            });
        },
        legendInit: function () {
            legend = L.control({ position: 'bottomright' });
            legend.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info legend')
                legend.update();
                return this._div;
            };
            legend.update = function () {
                if (type == "continents") {
                    this._div.innerHTML = "";
                    for (var i = 0; i < groupedData.length; i++) {
                        this._div.innerHTML +=
                            // '<i style="background:' + color(grades[i]) + '"></i> ' +
                            '<svg id="category' + i + '" width="10" height="10"><rect width="10" height="10"style="fill:' + baseColors(i) + ';stroke-width:1;stroke:rgb(0,0,0)"/></svg> ' +
                            groupedData[i].key + '<br>';
                    }
                }
                else if (type == "games") {
                    var max = d3.max(chartData.features, function (d) {
                        return ChoroplethHandler.getProperties(d);
                    });
                    var grades = new Array(), labels = [];
                    var legendCategories = 10;
                    var off = 0;
                    if (type == "continents")
                        off = 1;
                    if (propertyParams.length - off == 2) {
                        for (var i = 0; i <= legendCategories; i++) {
                            grades[i] = i / legendCategories;
                        }
                        // grades = [0, (1 / 4), (2 / 4), (3 / 4), 1];
                    }
                    else if (propertyParams.length - off == 1) {
                        for (var i = 0; i <= legendCategories; i++) {
                            grades[i] = Math.floor((i / legendCategories) * max);
                        }
                        // grades = [0, Math.floor((1 / 4) * max), Math.floor((2 / 4) * max), Math.floor((3 / 4) * max), Math.floor(max)];
                    }
                    this._div.innerHTML = "";
                    // loop through our density intervals and generate a label with a colored square for each interval
                    for (var i = 0; i < grades.length; i++) {
                        this._div.innerHTML +=
                            // '<i style="background:' + color(grades[i]) + '"></i> ' +
                            '<svg width="10" height="10"><rect width="10" height="10"style="fill:' + color(grades[i]) + ';stroke-width:1;stroke:rgb(0,0,0)"/></svg> ' +
                            ((propertyParams[off].includes("avg_play_time"))
                                ? getTime2w(grades[i])
                                : ((propertyParams.length - off == 2)
                                    ? (numberAsPercent(grades[i]))
                                    : (numberWithCommas(grades[i])))) + '<br>';
                    }
                }
            }
            legend.addTo(map);
        },
        controlsInit: function () {
            controls = L.control({ position: 'bottomleft' });
            controls.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info control');
                var form; // holds form element
                var radioBtn;

                if (type == "continents") {
                    function updateGroup(e) {
                        propertyParams[0] = this.value;
                        ChoroplethHandler.resetChartData();
                        ChoroplethHandler.updateMap();
                    }
                    form = $("<form id='groupForm'></form>");
                    // Continents
                    radioBtn = $('<input type="radio" name="groupForm" value="continent">Continents</br>');
                    radioBtn.on('change', updateGroup);
                    radioBtn.prop("checked", true);
                    form.append(radioBtn);
                    // Economy Group
                    radioBtn = $('<input type="radio" name="groupForm" value="economy">Economy Group</br>');
                    radioBtn.on('change', updateGroup);
                    form.append(radioBtn);
                    // Income Group
                    radioBtn = $('<input type="radio" name="groupForm" value="income_grp">Income Group</br>');
                    radioBtn.on('change', updateGroup);
                    form.append(radioBtn);
                    form.appendTo(this._div);
                }

                form = $("<form id='gamesForm'></form>");
                var gameIndex = 1; // 1-10
                var property = "owners";
                // games radio group
                for (var i = 1; i <= fileData.games.length; i++) {
                    radioBtn = $('<input type="radio" name="games" value=' + (i) + '>' + dictionary["game" + i] + '</br>');
                    if (i == 1) {
                        radioBtn.prop("checked", true);
                    }
                    if (type == "continents") {
                        radioBtn.on('change', function (e) {
                            gameIndex = this.value;
                            propertyParams[1] = "game" + gameIndex + property;
                            if (propertyParams.length == 3) {
                                propertyParams[1] = "game" + gameIndex + "active_users";
                                propertyParams[2] = "game" + gameIndex + "owners";
                            }
                            ChoroplethHandler.updateMap();
                        });
                    }
                    else if (type == "games") {
                        radioBtn.on('change', function (e) {
                            gameIndex = this.value;
                            propertyParams[0] = "game" + gameIndex + property;
                            if (propertyParams.length == 2) {
                                propertyParams[0] = "game" + gameIndex + "active_users";
                                propertyParams[1] = "game" + gameIndex + "owners";
                            }
                            ChoroplethHandler.updateMap();
                        });
                    }
                    form.append(radioBtn);
                }
                form.appendTo(this._div);
                // property handler

                function updateProperty(e) {
                    property = this.value;
                    if (type == "continents") {
                        propertyParams[1] = "game" + gameIndex + property;
                        propertyParams.splice(2, 1);
                    } else if (type == "games") {
                        propertyParams[0] = "game" + gameIndex + property;
                        propertyParams.splice(1, 1);
                    }
                    ChoroplethHandler.resetChartData();
                    ChoroplethHandler.updateMap();
                }
                form = $("<form id='propertyForm'></form>");
                // owners
                radioBtn = $('<input type="radio" name="propertyForm" value="owners">Owners</br>');
                radioBtn.on('change', updateProperty);
                radioBtn.prop("checked", true);
                form.append(radioBtn);
                // active
                radioBtn = $('<input type="radio" name="propertyForm" value="active_users">Active Users</br>');
                radioBtn.on('change', updateProperty);
                form.append(radioBtn);
                // average playtime
                radioBtn = $('<input type="radio" name="propertyForm" value="avg_play_time">Average Playtime</br>');
                radioBtn.on('change', updateProperty);
                form.append(radioBtn);
                // active users to owners relation
                radioBtn = $('<input type="radio" name="propertyForm">Active Users : Owners</br>');
                radioBtn.on('change', function (e) {
                    if (type == "continents") {
                        propertyParams[1] = "game" + gameIndex + "active_users";
                        propertyParams[2] = "game" + gameIndex + "owners";
                    } else if (type == "games") {
                        propertyParams[0] = "game" + gameIndex + "active_users";
                        propertyParams[1] = "game" + gameIndex + "owners";
                    }
                    ChoroplethHandler.resetChartData();
                    ChoroplethHandler.updateMap();
                });
                form.append(radioBtn);
                form.appendTo(this._div);

                controls.update();
                return this._div;
            };
            controls.update = function () {

            };
            controls.addTo(map);
        },
        hide: function () {
            $("#choropleth").hide();
        },
        show: function () {
            $("#choropleth").show();
        },
        attachControls: function () {
            ChoroplethHandler.legendInit();
            ChoroplethHandler.infoInit();
            ChoroplethHandler.controlsInit();
        },
        detachControls: function () {
            if (info != null)
                map.removeControl(info);
            if (legend != null)
                map.removeControl(legend);
            if (controls != null)
                map.removeControl(controls);
        },
        startBC: function (parameters) {
            type = parameters.type;
            propertyParams = null;
            propertyParams = parameters.properties;
            ChoroplethHandler.resetChartData();
            if (map == null) {
                map = L.map('choropleth');
                ChoroplethHandler.draw();
            }
            else {
                ChoroplethHandler.redraw();
            }
            ChoroplethHandler.attachControls();
            ChoroplethHandler.updateMap();
            ChoroplethHandler.show();
        },
        stopBC: function () {
            ChoroplethHandler.hide();
            ChoroplethHandler.detachControls();
            $(".tooltip").remove();
        }
    };
}());

var BarchartHandler = (function () {
    var type;
    var propertyParams; // in case of games its a suffix and 
    var barchartHTMLElem = document.getElementById("barChart");
    var ctrlHTMLElem;
    var chartData = new Array();
    var margin = { top: 10, right: 20, bottom: 20, left: 10 }
    var tooltipdiv;
    var width;
    var height;
    var svg = d3.select(barchartHTMLElem).append("svg");
    var labelWidth = 0;
    var sorted = false;
    var fixedBarHeight = true;
    var propertyMax = -1;
    return {
        // resets chartData, containing array/s with the data specifically for the current barchart parameters
        resetChartData: function () {
            if (type == "countries") {
                var countries = d3.nest()
                    .key(function (d) { return d.properties.name; })
                    .entries(fileData.features);

                var index = d3.range(countries.length);
                chartData[0] = index.map(function (i) {
                    return { "key": countries[i].key, "value": BarchartHandler.getProperties(countries[i].values[0]) };
                });
                // property is "game"[i]"property"
                for (var i = 0; i < fileData.games.length; i++) {
                    // var propertyName = str.propertyParams[0];
                    // d3.max(data, function (d) { return d.value })
                }
                propertyMax = 0;
            } else if (type == "games") {
                var types = ["owners", "active_users", "avg_play_time"];
                var games_num = fileData.games.length;
                var games = [new Array(games_num), new Array(games_num), new Array(games_num)];
                for (var t = 0; t < types.length; t++) {
                    for (var i = 1; i <= games_num; i++) {
                        var property_name = "game" + i + types[t];
                        var key = fileData.games[i - 1].Title;
                        if (types[t] != "avg_play_time") {
                            var total = d3.nest()
                                .rollup(function (v) {
                                    var value = d3.sum(v, function (d) { return d.properties[property_name]; });
                                    return {
                                        "key": key,
                                        "value": value
                                    };
                                })
                                .object(fileData.features);
                        }
                        else {
                            var activeUsersProperty = "game" + i + types[1];
                            var total = d3.nest()
                                .rollup(function (v) {
                                    var dividend = (d3.sum(v, function (d) { return (d.properties[property_name] * d.properties[activeUsersProperty]); }));
                                    var divisor = games[1][i - 1]["value"];
                                    return {
                                        "key": key,
                                        "value": Math.floor(dividend / divisor)
                                    };
                                })
                                .object(fileData.features);
                        }
                        games[t][i - 1] = total;
                    }
                }
                chartData = games;
            }
        },
        getData: function () {
            var data = new Array();
            if (type == "countries") {
                data = chartData[0];
            } else if (type == "games") {
                switch (propertyParams[0]) {
                    case 'owners': data = chartData[0]; break;
                    case 'active_users': data = chartData[1]; break;
                    case 'avg_play_time': data = chartData[2]; break;
                }
            }
            if (sorted) {
                data.sort(function (a, b) {
                    return a.value - b.value;
                });
            } else {
                data.sort(function (a, b) {
                    var keyA = a.key.toUpperCase(); // ignore upper and lowercase
                    var keyB = b.key.toUpperCase(); // ignore upper and lowercase
                    if (keyA < keyB) {
                        return -1;
                    }
                    if (keyA > keyB) {
                        return 1;
                    }
                    // names must be equal
                    return 0;
                });
            }
            return data;
        },
        getProperties: function (d) {
            if (type == "countries") {
                if (propertyParams.length > 1) {
                    if (d.properties[propertyParams[1]] == 0) {
                        return 0;
                    }
                    return d.properties[propertyParams[0]] / d.properties[propertyParams[1]];
                }
                else {
                    return d.properties[propertyParams[0]];
                }
            }
        },
        getXfunc: function () {
            var data = BarchartHandler.getData();
            if (propertyParams.length == 2) {
                return d3.scaleLinear()
                    .domain([0, 1])
                    .range([0, width - labelWidth]);
            }
            // else if(propertyParams[0] == "avg_play_time"){
            //     return d3.scaleLinear()
            //TODO: change domain to a dummy date
            //         .domain([0, 1])
            //         .range([0, width - labelWidth]);
            // }
            return d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return d.value })])
                .range([0, width - labelWidth]);
        },
        getYfunc: function () {
            var index = d3.range(chartData[0].length);
            return d3.scaleBand()
                .domain(index)
                .range([0, height])
                .padding(.1);;
        },
        redraw: function () {
            BarchartHandler.show();
            // clear previous svg 
            // svg.selectAll("*").remove(); // this may work
            d3.select(barchartHTMLElem).selectAll("svg").remove();
            // if resize happened - need to recalc 'width' and 'height'
            width = (0.9) * ((barchartHTMLElem).clientWidth) - margin.left - margin.right;
            if (fixedBarHeight) {
                height = (15 * (BarchartHandler.getData().length)) - margin.top - margin.bottom;
            }
            else {
                height = ((barchartHTMLElem).clientHeight) - margin.top - margin.bottom;
            }
            // and recalc the X and Y functions, which depend on 'width' and 'height'
            // position the canvas
            svg = d3.select(barchartHTMLElem).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var y = BarchartHandler.getYfunc();
            var bar = svg.selectAll(".bar")
                .data(BarchartHandler.getData())
                .enter().append("g");
            bar.attr("class", "bar")
                .attr("transform", function (d, i) {
                    return "translate(" + margin.top + "," + y(i) + ")";
                })

            if (propertyParams[0] == "avg_play_time") {
                bar
                    .on("mouseover", function (d) {
                        tooltipdiv.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltipdiv.html(d.key + "<br/>" + getTime2w(d.value))
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function (d) {
                        tooltipdiv.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            }
            else if (propertyParams.length == 2) {
                bar
                    .on("mouseover", function (d) {
                        tooltipdiv.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltipdiv.html(d.key + "<br/>" + numberAsPercent(d.value))
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function (d) {
                        tooltipdiv.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            } else {
                bar
                    .on("mouseover", function (d) {
                        tooltipdiv.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltipdiv.html(d.key + "<br/>" + numberWithCommas(d.value))
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function (d) {
                        tooltipdiv.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            }
            var barHeight = y.bandwidth();
            labelWidth = 0;
            if (y.bandwidth() > 10) {
                bar.append("text")
                    .attr("y", y.bandwidth() / 2)
                    .attr("dy", ".35em") //vertical align middle
                    .style("font-size", function (d) { return Math.min(10, (y.bandwidth()) / this.getComputedTextLength() * 24) + "px"; })
                    .style("text-align", "right")
                    .text(function (d) {
                        return d.key;
                    }).each(function () {
                        labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
                    });
            }
            var x = BarchartHandler.getXfunc();
            bar.append("rect")
                .attr("transform", "translate(" + labelWidth + ", 0)")
                .attr("height", y.bandwidth())
                .attr("width", function (d) { return x(d.value) });
            if (y.bandwidth() > 10) {
                bar.append("text")
                    .attr("y", barHeight / 2)
                    .attr("dx", labelWidth) //margin right
                    .attr("dy", ".35em") //vertical align middle
                    .style("font-size", function (d) { return Math.min(10, (y.bandwidth()) / this.getComputedTextLength() * 24) + "px"; })
                    .attr("text-anchor", "end")
                    .text(function (d) {
                        // case of fraction :
                        if (propertyParams.length == 2) {
                            return (numberAsPercent(d.value));
                        }
                        return ((propertyParams[0] == "avg_play_time")
                            ? (getTime2w(d.value))
                            : (numberWithCommas(d.value)));
                    })
                    .attr("x", function (d) {
                        var width = this.getBBox().width;
                        return Math.max(width, x(d.value));
                    });
            }
            if (propertyParams[0] == "avg_play_time") {
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + (labelWidth + margin.left) + "," + height + ")")
                    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M")));
            }
            else {
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + (labelWidth + margin.left) + "," + height + ")")
                    .call(d3.axisBottom(x));
            }
        },
        hide: function () {
            d3.select(barchartHTMLElem).selectAll("svg").remove();

            if (barchartHTMLElem != null) {
                if (!barchartHTMLElem.classList.contains("invisible")) {
                    barchartHTMLElem.classList.add("invisible");
                }
            }
        },
        show: function () {
            if (barchartHTMLElem != null) {
                if (barchartHTMLElem.classList.contains("invisible")) {
                    barchartHTMLElem.classList.remove("invisible");
                }
            }
        },
        attachControls: function () {
            // control buttons attachment
            // varies depending on the type of the barchart

            ctrlHTMLElem = $("<div class='countriesControl'></div>").appendTo(barchartHTMLElem);
            var jdiv = (ctrlHTMLElem); // holds the div to which control belongs
            var form; // holds form element
            var radioBtn;
            var sortCtrl = ($("<input type='checkbox'>"))
                .appendTo(($("<label>Sort values</label>"))
                    .appendTo(jdiv));

            if (sorted) {
                sortCtrl.prop("checked", true);
            }
            // attach sort for both types

            sortCtrl.on('change', function (e) {
                if (this.checked) {
                    sorted = true;
                } else {
                    sorted = false;
                }
                BarchartHandler.resetChartData();
                BarchartHandler.redraw();
            });

            var fixedBarHeightCtrl = ($("<input type='checkbox'>"))
                .appendTo(($("<label>Fixed bar size</label>"))
                    .appendTo(jdiv));
            if (fixedBarHeight) {
                fixedBarHeightCtrl.prop("checked", true);
            }
            fixedBarHeightCtrl.on('click', function (e) {
                if (this.checked) {
                    fixedBarHeight = true;
                } else {
                    fixedBarHeight = false;
                }
                BarchartHandler.resetChartData();
                BarchartHandler.redraw();
            });

            // if countries - attach control group (game[0-10]|owners/active/average time/active:owners) 
            //                                      radio      radio         
            if (type == "countries") {
                form = $("<form id='gamesForm'></form>");
                var gameIndex = 1; // 1-10
                var property = "owners";
                // games radio group
                for (var i = 1; i <= fileData.games.length; i++) {

                    radioBtn = $('<input type="radio" name="games" value=' + (i) + '>' + dictionary["game" + i] + '</br>');
                    if (i == 1) {
                        radioBtn.prop("checked", true);
                    }
                    radioBtn.on('change', function (e) {
                        gameIndex = this.value;
                        propertyParams[0] = "game" + gameIndex + property;
                        if (propertyParams.length == 2) {
                            propertyParams[0] = "game" + gameIndex + "active_users";
                            propertyParams[1] = "game" + gameIndex + "owners";
                        }
                        BarchartHandler.resetChartData();
                        BarchartHandler.redraw();
                    });
                    form.append(radioBtn);
                }
                form.appendTo(jdiv);
                // property handler
                function updateProperty(e) {
                    property = this.value;
                    propertyParams[0] = "game" + gameIndex + property;
                    propertyParams.splice(1, 1);
                    BarchartHandler.resetChartData();
                    BarchartHandler.redraw();
                }
                form = $("<form id='propertyForm'></form>");
                // owners
                radioBtn = $('<input type="radio" name="propertyForm" value="owners">Owners</br>');
                radioBtn.on('change', updateProperty);
                radioBtn.prop("checked", true);
                form.append(radioBtn);
                // active
                radioBtn = $('<input type="radio" name="propertyForm" value="active_users">Active Users</br>');
                radioBtn.on('change', updateProperty);
                form.append(radioBtn);
                // average playtime
                radioBtn = $('<input type="radio" name="propertyForm" value="avg_play_time">Average Playtime</br>');
                radioBtn.on('change', updateProperty);
                form.append(radioBtn);
                // active users to owners relation
                radioBtn = $('<input type="radio" name="propertyForm">Active Users : Owners</br>');
                radioBtn.on('change', function (e) {
                    propertyParams[0] = "game" + gameIndex + "active_users";
                    propertyParams[1] = "game" + gameIndex + "owners";
                    BarchartHandler.resetChartData();
                    BarchartHandler.redraw();
                });
                form.append(radioBtn);
                form.appendTo(jdiv);

            }
            // if games - attach control group (owners/active/average playtime/active:owners)
            //                                  radio
            else if (type == "games") {
                var property = "owners";
                function updateProperty(e) {
                    property = this.value;
                    propertyParams[0] = property;
                    BarchartHandler.resetChartData();
                    BarchartHandler.redraw();
                }
                form = $("<form id='propertyForm'></form>");
                // owners
                radioBtn = $('<input type="radio" name="propertyForm" value="owners">Owners</br>');
                radioBtn.on('change', updateProperty);
                radioBtn.prop("checked", true);
                form.append(radioBtn);
                // active
                radioBtn = $('<input type="radio" name="propertyForm" value="active_users">Active Users</br>');
                radioBtn.on('change', updateProperty);
                form.append(radioBtn);
                // average playtime
                radioBtn = $('<input type="radio" name="propertyForm" value="avg_play_time">Average Playtime</br>');
                radioBtn.on('change', updateProperty);
                form.append(radioBtn);
                form.appendTo(jdiv);
            }


        },
        detachControls: function () {
            // control buttons detachment
            $(ctrlHTMLElem).remove();
        },
        startBC: function (parameters) {
            tooltipdiv = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            type = parameters.type;
            propertyParams = parameters.properties;
            barchartHTMLElem = document.getElementById("barChart");
            BarchartHandler.attachControls();
            BarchartHandler.resetChartData();
            BarchartHandler.redraw();
            window.addEventListener("resize", BarchartHandler.redraw);
        },
        stopBC: function () {
            window.removeEventListener("resize", BarchartHandler.redraw);
            BarchartHandler.hide();
            BarchartHandler.detachControls();
            $(".tooltip").remove();
        }
    };
}());

var StackedBarchartHandler = (function () {
    var type;
    var propertyParams; // in case of games its a suffix and 
    var barchartHTMLElem = document.getElementById("stackedBarChart");
    var ctrlHTMLElem;
    var chartData = new Array(); // casual, moderate, excessive for example
    var margin = { top: 10, right: 20, bottom: 20, left: 10 }
    var tooltipdiv;
    var width;
    var height;
    var svg = d3.select(barchartHTMLElem).append("svg");
    var labelWidth = 0;
    var percent = false;
    var fixedBarHeight = true;
    var sorted = false;
    return {
        // resets chartData, containing array/s with the data specifically for the current barchart parameters
        resetChartData: function () {
            chartData = [];
            if (type == "games") {
                if (propertyParams[0] == "addiction_cat") {
                    // if the propertyParams[0] is user_cat -> stacks of casual,moderate,excessive
                    // the index of the game
                    var types = ["casual_users", "moderate_users", "excessive_users"];
                    var games_num = fileData.games.length;
                    var games = [new Array(games_num), new Array(games_num), new Array(games_num)];
                    for (var t = 0; t < types.length; t++) {
                        chartData[t] = [];
                        for (var i = 1; i <= games_num; i++) {
                            var property_name = "game" + i + types[t];
                            var total = d3.nest()
                                .rollup(function (v) {
                                    var value = (d3.sum(v, function (d) { return (d.properties[property_name]); }));
                                    return value;
                                })
                                .object(fileData.features);
                            games[t][i - 1] = total;
                            chartData[t][i - 1] = { "key": property_name, "value": "" };
                        }
                    }
                    // labels
                    chartData[types.length] = new Array(games_num);
                    for (var i = 1; i <= games_num; i++) {
                        chartData[types.length][i - 1] = { "key": dictionary["game" + i], "value": null };
                    }
                    // percent case
                    if (percent) {
                        // 3 * 10 (3 cats. 10 games for example)
                        for (var j = 0; j < games[0].length; j++) {
                            var sum = 0, difference = 0;
                            for (var i = 0; i < games.length; i++) {
                                sum += games[i][j];
                            }
                            for (var i = 0; i < games.length; i++) {
                                if (sum == 0)
                                    games[i][j] = 0;
                                games[i][j] = games[i][j] / sum; // percent value
                            }
                        }
                    }
                    var xz = d3.range(games_num);
                    games = d3.stack().keys(d3.range(types.length))(d3.transpose(games));
                    // after the stack is done
                    // migrate derived series to chartData
                    for (var t = 0; t < types.length; t++) {
                        for (var i = 1; i <= games_num; i++) {
                            chartData[t][i - 1].key = dictionary[chartData[t][i - 1].key];
                            chartData[t][i - 1].value = games[t][i - 1];
                        }
                    }

                } else if (propertyParams[0] == "aoRelation") {
                    var types = ["owners", "active_users"];
                    var games_num = fileData.games.length;
                    var games = [new Array(games_num), new Array(games_num)];
                    // reverse order because of the 
                    // all the active
                    chartData[1] = [];
                    for (var i = 1; i <= games_num; i++) {
                        var property_name = "game" + i + types[1];
                        var total = d3.nest()
                            .rollup(function (v) {
                                var value = (d3.sum(v, function (d) { return (d.properties[property_name]); }));
                                return value;
                            })
                            .object(fileData.features);
                        games[1][i - 1] = total;
                        chartData[1][i - 1] = { "key": property_name, "value": "" };
                    }
                    // all the non-active (for stacking purposes)
                    chartData[0] = [];
                    for (var i = 1; i <= games_num; i++) {
                        var property_name = "game" + i + types[0];
                        var total = d3.nest()
                            .rollup(function (v) {
                                var value = (d3.sum(v, function (d) { return (d.properties[property_name]); }));
                                return value;
                            })
                            .object(fileData.features);
                        games[0][i - 1] = total - games[1][i - 1];
                        chartData[0][i - 1] = { "key": property_name + "_na", "value": "" };
                    }
                    // difference for stacking
                    for (var i = 1; i <= games_num; i++) {
                        games[0][i - 1] -= games[1][i - 1];
                    }

                    // labels
                    chartData[types.length] = new Array(games_num);
                    for (var i = 1; i <= games_num; i++) {
                        chartData[types.length][i - 1] = { "key": dictionary["game" + i], "value": null };
                    }
                    // percent case
                    if (percent) {
                        // 3 * 10 (3 cats. 10 games for example)
                        for (var j = 0; j < games[0].length; j++) {
                            var sum = 0, difference = 0;
                            for (var i = 0; i < games.length; i++) {
                                sum += games[i][j];
                            }
                            for (var i = 0; i < games.length; i++) {
                                if (sum == 0)
                                    games[i][j] = 0;
                                else
                                    games[i][j] = games[i][j] / sum; // percent value
                            }
                        }
                    }
                    var xz = d3.range(games_num);
                    games = d3.stack().keys(d3.range(types.length))(d3.transpose(games));
                    // after the stack is done
                    // migrate derived series to chartData
                    for (var t = 0; t < types.length; t++) {
                        for (var i = 1; i <= games_num; i++) {
                            chartData[t][i - 1].key = dictionary[chartData[t][i - 1].key];
                            chartData[t][i - 1].value = games[t][i - 1];
                        }
                    }

                }
            } else if (type == "countries") {
                if (propertyParams[0] == "addiction_cat") {
                    // if the propertyParams[0] is user_cat -> stacks of casual,moderate,excessive
                    // the index of the game
                    var types = ["casual_users", "moderate_users", "excessive_users"];
                    var countries_num = fileData.features.length;
                    var countries = [new Array(countries_num), new Array(countries_num), new Array(countries_num)];
                    var features = d3.nest()
                        .key(function (d) { return d.properties.name; })
                        .entries(fileData.features);
                    for (var t = 0; t < types.length; t++) {
                        chartData[t] = new Array(countries_num);

                        var property = "game" + propertyParams[1] + types[t];
                        var index = d3.range(countries_num);
                        countries[t] = index.map(function (i) {
                            return features[i].values[0].properties[property];
                        });
                        for (var i = 0; i < countries_num; chartData[t][i++] = { "key": property, "value": "" });

                        // property is "game"[i]"property"
                        for (var i = 0; i < fileData.games.length; i++) {
                            // var propertyName = str.propertyParams[0];
                            // d3.max(data, function (d) { return d.value })
                        }
                    }
                    // labels
                    chartData[types.length] = new Array(countries_num);
                    for (var i = 0; i < features.length; i++) {
                        chartData[types.length][i] = { "key": features[i].key };
                    }
                    // percent case
                    if (percent) {
                        // 3 * 10 (3 cats. 10 games for example)
                        for (var j = 0; j < countries[0].length; j++) {
                            var sum = 0, difference = 0;
                            for (var i = 0; i < countries.length; i++) {
                                sum += countries[i][j];
                            }
                            for (var i = 0; i < countries.length; i++) {
                                if (sum == 0)
                                    countries[i][j] = 0;
                                else
                                    countries[i][j] = countries[i][j] / sum; // percent value
                            }
                        }
                    }
                    var xz = d3.range(countries_num);
                    countries = d3.stack().keys(d3.range(types.length))(d3.transpose(countries));
                    // after the stack is done
                    // migrate derived series to chartData
                    for (var t = 0; t < types.length; t++) {
                        for (var i = 0; i < countries_num; i++) {
                            chartData[t][i].key = chartData[types.length][i].key + "<br>" + dictionary[chartData[t][i].key];
                            chartData[t][i].value = countries[t][i];
                        }
                    }

                } else if (propertyParams[0] == "aoRelation") {
                    var types = ["owners", "active_users"];
                    var countries_num = fileData.features.length;
                    var countries = [new Array(countries_num), new Array(countries_num)];
                    var features = d3.nest()
                        .key(function (d) { return d.properties.name; })
                        .entries(fileData.features);

                    // active
                    chartData[1] = new Array(countries_num);

                    var property = "game" + propertyParams[1] + types[1];
                    var index = d3.range(countries_num);
                    countries[1] = index.map(function (i) {
                        return features[i].values[0].properties[property];
                    });
                    for (var i = 0; i < countries_num; chartData[1][i++] = { "key": property, "value": "" });

                    // owners 
                    chartData[0] = new Array(countries_num);

                    var property = "game" + propertyParams[1] + types[0];
                    countries[0] = index.map(function (i) {
                        return features[i].values[0].properties[property];
                    });
                    for (var j = 0; j < countries_num; j++) {
                        countries[0][j] = countries[0][j] - countries[1][j];
                    }
                    for (var i = 0; i < countries_num; chartData[0][i++] = { "key": property + "_na", "value": "" });

                    // property is "game"[i]"property"
                    for (var i = 0; i < fileData.games.length; i++) {
                        // var propertyName = str.propertyParams[0];
                        // d3.max(data, function (d) { return d.value })
                    }

                    // labels
                    chartData[types.length] = new Array(countries_num);
                    for (var i = 0; i < features.length; i++) {
                        chartData[types.length][i] = { "key": features[i].key };
                    }
                    // percent case
                    if (percent) {
                        // 3 * 10 (3 cats. 10 games for example)
                        for (var j = 0; j < countries[0].length; j++) {
                            var sum = 0, difference = 0;
                            for (var i = 0; i < countries.length; i++) {
                                sum += countries[i][j];
                            }
                            for (var i = 0; i < countries.length; i++) {
                                if (sum == 0)
                                    countries[i][j] = 0;
                                else
                                    countries[i][j] = countries[i][j] / sum; // percent value
                            }
                        }
                    }
                    var xz = d3.range(countries_num);
                    countries = d3.stack().keys(d3.range(types.length))(d3.transpose(countries));
                    // after the stack is done
                    // migrate derived series to chartData
                    for (var t = 0; t < types.length; t++) {
                        for (var i = 0; i < countries_num; i++) {
                            chartData[t][i].key = chartData[types.length][i].key + "<br>" + dictionary[chartData[t][i].key];
                            chartData[t][i].value = countries[t][i];
                        }
                    }

                }
            }

            var transposedChartData = transposeArray(chartData);
            if (sorted) {
                var sortfunc;
                if (percent) {
                    sortfunc = function (a, b) {
                        var valueA, valueB;
                        for (var i = types.length - 1; i >= 0; i--) {
                            valueA = a[i].value[1] - a[i].value[0];
                            valueB = b[i].value[1] - b[i].value[0];
                            if (valueA != valueB)
                                return valueA - valueB;
                        }
                        return 0;
                    }
                }
                else {
                    sortfunc = function (a, b) {
                        var valueA = a[types.length - 1].value[1]; // ignore upper and lowercase
                        var valueB = b[types.length - 1].value[1]; // ignore upper and lowercase
                        return valueA - valueB;
                    }
                }
                transposedChartData.sort(sortfunc);
            }
            else {
                transposedChartData.sort(function (a, b) {
                    var keyA = a[types.length].key.toUpperCase(); // ignore upper and lowercase
                    var keyB = b[types.length].key.toUpperCase(); // ignore upper and lowercase
                    if (keyA < keyB) {
                        return -1;
                    }
                    if (keyA > keyB) {
                        return 1;
                    }
                    // names must be equal
                    return 0;
                });
            }
            chartData = transposeArray(transposedChartData);
        },
        getData: function () {
            // the last arrays of chartData is labels
            var data = chartData.slice(0, (chartData.length - 1));
            return data;
        },
        getLabels: function () {
            var labels = chartData[chartData.length - 1];
            return labels;
        },
        getXfunc: function () {
            var data = StackedBarchartHandler.getData();
            if (percent) {
                return d3.scaleLinear()
                    .domain([0, 1])
                    .range([0, width - labelWidth]);
            }
            return d3.scaleLinear()
                .domain([0, d3.max(data, function (y) { return d3.max(y, function (d) { return d.value[1]; }); })])
                .range([0, width - labelWidth]);
        },
        getYfunc: function () {
            var index = d3.range(StackedBarchartHandler.getData()[0].length);
            return d3.scaleBand()
                .domain(index)
                .range([0, height])
                .padding(.1);
        },
        redraw: function () {
            StackedBarchartHandler.show();
            // clear previous svg 
            // svg.selectAll("*").remove(); // this may work
            d3.select(barchartHTMLElem).selectAll("svg").remove();
            // if resize happened - need to recalc 'width' and 'height'
            width = (0.9) * ((barchartHTMLElem).clientWidth) - margin.left - margin.right;
            if (fixedBarHeight) {
                height = (15 * (StackedBarchartHandler.getData()[0].length)) - margin.top - margin.bottom;
            }
            else {
                height = ((barchartHTMLElem).clientHeight) - margin.top - margin.bottom;
            }
            // and recalc the X and Y functions, which depend on 'width' and 'height'
            // position the canvas
            svg = d3.select(barchartHTMLElem).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var y = StackedBarchartHandler.getYfunc();
            var x = StackedBarchartHandler.getXfunc();

            var color = d3.scaleOrdinal()
                .domain(d3.range(chartData.length))
                .range(["#ffeda0", "#feb24c", "#f03b20"]);


            labelWidth = 0;
            if (y.bandwidth() > 10) {
                var labels = svg
                    .append("g")
                    .selectAll()
                    .attr("class", "labels")
                    .data(StackedBarchartHandler.getLabels())
                    .enter().append("text")
                    .attr("y", function (d, i) { return (y(i)) + y.bandwidth() / 2 })
                    .attr("dy", ".35em") //vertical align middle
                    .style("font-size", function (d) { return Math.min(10, (y.bandwidth()) / this.getComputedTextLength() * 24) + "px"; })
                    .style("text-align", "right")
                    .text(function (d) {
                        return d.key;
                    }).each(function () {
                        labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
                    });
            }
            x = StackedBarchartHandler.getXfunc();

            var series = svg
                .append("g")
                .attr("transform", "translate(" + labelWidth + ",0)")
                .selectAll(".series")
                .data(StackedBarchartHandler.getData())
                .enter().append("g")
                .attr("fill", function (d, i) { return color(i); });

            var rect = series.selectAll("rect")
                .data(function (d) { return d; })
                .enter().append("rect")
                .attr("y", function (d, i) { return y(i); })
                .attr("x", function (d) { return x(d.value[0]); })
                .attr("height", y.bandwidth())
                .attr("width", function (d) { return x(d.value[1]) - x(d.value[0]); })
                .on("mouseover", function (d) {
                    tooltipdiv.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltipdiv.html(d.key + "<br/>" +
                        (percent
                            ? numberAsPercent((d.value[1] - d.value[0]))
                            : numberWithCommas(d.value[1] - d.value[0])))
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    tooltipdiv.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            var barHeight = y.bandwidth();

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + (labelWidth) + "," + (height) + ")")
                .call(d3.axisBottom(x));
        },
        hide: function () {
            d3.select(barchartHTMLElem).selectAll("svg").remove();

            if (barchartHTMLElem != null) {
                if (!barchartHTMLElem.classList.contains("invisible")) {
                    barchartHTMLElem.classList.add("invisible");
                }
            }
        },
        show: function () {
            if (barchartHTMLElem != null) {
                if (barchartHTMLElem.classList.contains("invisible")) {
                    barchartHTMLElem.classList.remove("invisible");
                }
            }
        },
        attachControls: function () {
            // control buttons attachment
            // varies depending on the type of the barchart

            ctrlHTMLElem = $("<div class='countriesControl'></div>").appendTo(barchartHTMLElem);
            var jdiv = (ctrlHTMLElem); // holds the div to which control belongs
            var form; // holds form element
            var radioBtn;

            var percentCtrl = ($("<input type='checkbox'>"))
                .appendTo(($("<label>In percents</label>"))
                    .appendTo(jdiv));

            if (percent) {
                percentCtrl.prop("checked", true);
            }
            // attach sort for both types

            percentCtrl.on('change', function (e) {
                if (this.checked) {
                    percent = true;
                } else {
                    percent = false;
                }
                StackedBarchartHandler.resetChartData();
                StackedBarchartHandler.redraw();
            });

            var sortCtrl = ($("<input type='checkbox'>"))
                .appendTo(($("<label>Sort values</label>"))
                    .appendTo(jdiv));

            if (sorted) {
                sortCtrl.prop("checked", true);
            }
            // attach sort for both types

            sortCtrl.on('change', function (e) {
                if (this.checked) {
                    sorted = true;
                } else {
                    sorted = false;
                }
                StackedBarchartHandler.resetChartData();
                StackedBarchartHandler.redraw();
            });

            var fixedBarHeightCtrl = ($("<input type='checkbox'>"))
                .appendTo(($("<label>Fixed bar size</label>"))
                    .appendTo(jdiv));
            if (fixedBarHeight) {
                fixedBarHeightCtrl.prop("checked", true);
            }
            fixedBarHeightCtrl.on('click', function (e) {
                if (this.checked) {
                    fixedBarHeight = true;
                } else {
                    fixedBarHeight = false;
                }
                StackedBarchartHandler.resetChartData();
                StackedBarchartHandler.redraw();
            });


            var property = "owners";
            function updateProperty(e) {
                property = this.value;
                propertyParams[0] = property;
                StackedBarchartHandler.resetChartData();
                StackedBarchartHandler.redraw();
            }
            form = $("<form id='propertyForm'></form>");
            // addiction category casual / moderate / excessive
            radioBtn = $('<input type="radio" name="propertyForm" value="addiction_cat">Addiction Category</br>');
            radioBtn.on('change', updateProperty);
            radioBtn.prop("checked", true);
            form.append(radioBtn);
            // active
            radioBtn = $('<input type="radio" name="propertyForm" value="aoRelation">Active Users : Owners</br>');
            radioBtn.on('change', updateProperty);
            form.append(radioBtn);
            // average playtime

            form.appendTo(jdiv);

            if (type == "countries") {
                form = $("<form id='gamesForm'></form>");
                var gameIndex = 1; // 1-10
                var property = "owners";
                // games radio group
                for (var i = 1; i <= fileData.games.length; i++) {
                    radioBtn = $('<input type="radio" name="games" value=' + (i) + '>' + dictionary["game" + i] + '</br>');
                    if (i == 1) {
                        radioBtn.prop("checked", true);
                    }
                    radioBtn.on('change', function (e) {
                        gameIndex = this.value;
                        propertyParams[1] = gameIndex;
                        StackedBarchartHandler.resetChartData();
                        StackedBarchartHandler.redraw();
                    });
                    form.append(radioBtn);
                }
                form.appendTo(jdiv);
            }

        },
        detachControls: function () {
            // control buttons detachment
            $(ctrlHTMLElem).remove();
        },
        startSBC: function (parameters) {
            tooltipdiv = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            type = parameters.type;
            propertyParams = parameters.properties;
            barchartHTMLElem = document.getElementById("stackedBarChart");
            StackedBarchartHandler.attachControls();
            StackedBarchartHandler.resetChartData();
            StackedBarchartHandler.redraw();
            window.addEventListener("resize", StackedBarchartHandler.redraw);
        },
        stopSBC: function () {
            window.removeEventListener("resize", StackedBarchartHandler.redraw);
            StackedBarchartHandler.hide();
            StackedBarchartHandler.detachControls();
            $(".tooltip").remove();
        }
    };
}());


var RadialAxisHandler = (function () {
    var type;
    var propertyParams; // in case of games its a suffix and 
    var radialGraphElem = document.getElementById("RadialGraph");
    // var ctrlHTMLElem;
    var chartData = new Array();
    var polygonName = new Array();
    var margin = { top: 10, right: 20, bottom: 20, left: 10 }
    var tooltip;
    var width;
    var height;
    var svg = d3.select(radialGraphElem).append("svg");
    var labelWidth = 0;
    // var sorted = false;
    return {
        // resets chartData, containing array/s with the data specifically for the current barchart parameters
        resetChartData: function () {
            if (type == "games") {
                var types = ["owners", "active_users", "avg_play_time"];
                var games_num = fileData.games.length;
                var games = [new Array(games_num), new Array(games_num), new Array(games_num)];
                for (var t = 0; t < types.length; t++) {
                    for (var i = 1; i <= games_num; i++) {
                        var property_name = "game" + i + types[t];
                        if (types[t] != "avg_play_time") {
                            var total = d3.nest()
                                .rollup(function (v) {
                                    var value = d3.sum(v, function (d) { return d.properties[property_name]; });
                                    return {
                                        "property": types[t],
                                        "value": value
                                    };
                                })
                                .object(fileData.features);
                        }
                        else {
                            var activeUsersProperty = "game" + i + types[1];
                            var total = d3.nest()
                                .rollup(function (v) {
                                    var dividend = (d3.sum(v, function (d) { return (d.properties[property_name] * d.properties[activeUsersProperty]); }));
                                    var divisor = games[1][i - 1]["value"];
                                    return {
                                        "property": types[t],
                                        "value": Math.floor(dividend / divisor)
                                    };
                                })
                                .object(fileData.features);
                        }
                        games[t][i - 1] = total;
                    }
                }
                var games_properties = [new Array(games_num), new Array(games_num)];
                var games_properties_types = ["Rating", "price"];

                var maxValue = d3.max(fileData.games, function (d) { return d["price"]; });
                for (var t = 0; t < games_properties_types.length; t++) {
                    for (var i = 1; i <= games_num; i++) {
                        var value = fileData.games[i - 1][games_properties_types[t]];
                        if (games_properties_types[t] == "price") {
                            value = maxValue - value;
                        }
                        games_properties[t][i - 1] = {
                            "property": games_properties_types[t],
                            "value": value
                        };
                    }
                }
                //get the polygon names
                polygonName = [];
                for (var i = 1; i <= games_num; i++) {
                    polygonName.push(fileData.games[i - 1]["Title"]);
                }
                // concat the 2 arrays to 1 single array
                Array.prototype.push.apply(games, games_properties);

                chartData = transposeArray(games);

            } else if (type == "economy") {
                var nestedData = d3.nest()
                    .key(function (d) { return d.properties.name_long; })
                    .rollup(function (v) {
                        return [
                            v[0].properties.money_spent,
                            v[0].properties.gdp_md_est,
                            7 - parseInt(v[0].properties.economy.slice(0, 1)), // there are 7 economy groups
                            5 - parseInt(v[0].properties.income_grp.slice(0, 1)) // there are 5 economy groups
                        ];
                    })
                    .entries(fileData.features);

                var axisNames = ["Money Spent (in USD)", "Average GDP (in millions of USD)",
                    "Economy level", "Income Group"];

                //get the polygon names
                polygonName = [];

                //for each continent
                for (var country_num = 0; country_num < nestedData.length; country_num++) {
                    polygonName.push(nestedData[country_num].key);
                    // for each country
                    var newCountryData = [];
                    for (var property = 0; property < nestedData[country_num].value.length; property++) {
                        newCountryData[property] = { "property": axisNames[property], "value": nestedData[country_num].value[property] }
                    }
                    nestedData[country_num] = newCountryData;
                }
                chartData = nestedData;

            } else if (type == "continents") {
                var nestedData = d3.nest()
                    .key(function (d) { return d.properties.continent; })
                    .rollup(function (v) {
                        return [
                            d3.sum(v, function (d) { return d.properties.country_owners; }),
                            d3.sum(v, function (d) { return d.properties.country_active; }),
                            d3.sum(v, function (d) { return d.properties.avg_play_time * d.properties.country_active; }) / d3.sum(v, function (d) { return d.properties.country_active; }) / (60 * 14),
                            d3.sum(v, function (d) { return d.properties.money_spent; }),
                            d3.mean(v, function (d) { return d.properties.gdp_md_est; })
                        ];
                    })
                    .entries(fileData.features);

                //get the polygon names
                polygonName = [];

                var axisNames = ["Owners", "Active", "Average Play Time (in hours per day)",
                    "Money Spent (in USD)", "Average GDP (in millions of USD)"];

                //for each continent
                for (var continent_num = 0; continent_num < nestedData.length; continent_num++) {
                    polygonName.push(nestedData[continent_num].key);
                    // for each country
                    var newContinentData = [];
                    for (var property = 0; property < nestedData[continent_num].value.length; property++) {
                        newContinentData[property] = { "property": axisNames[property], "value": nestedData[continent_num].value[property] }
                    }
                    nestedData[continent_num] = newContinentData;
                }

                chartData = nestedData;
            }
        },
        getData: function () {
            return chartData;
        },
        redraw: function () {
            RadialAxisHandler.show();

            // clear previous svg 
            // svg.selectAll("*").remove(); // this may work
            d3.select(radialGraphElem).selectAll("svg").remove();
            // if resize happened - need to recalc 'width' and 'height'
            width = (0.9) * ((radialGraphElem).clientWidth) - margin.left - margin.right;
            height = (0.9) * ((radialGraphElem).clientHeight) - margin.top - margin.bottom;
            // and recalc the X and Y functions, which depend on 'width' and 'height'
            // position the canvas
            // svg = d3.select(radialGraphElem).append("svg")
            //     .attr("width", width + margin.left + margin.right)
            //     .attr("height", height + margin.top + margin.bottom)
            //     .append("g")
            //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            // Radial Graph ----from here
            var RadarChart = {
                draw: function (id, d, polygonName) {
                    var cfg = {
                        radius: 5,
                        // w: Math.min(width, height),
                        // h: Math.min(width, height),
                        w: 256,
                        h: 256,
                        factor: 1,
                        factorLegend: .85,
                        levels: 3,
                        maxValue: new Array(),
                        radians: 2 * Math.PI,
                        opacityArea: 0.5,
                        ToRight: 5,
                        TranslateX: 80,
                        TranslateY: 30,
                        ExtraWidthX: 100,
                        ExtraWidthY: 100,
                        color: d3.scaleOrdinal().range(["#ff0000", "#0000ff"])
                    };
                    var data = d;
                    var temp = transposeArray(chartData);
                    for (var i = 0; i < temp.length; i++) {
                        cfg.maxValue[i] = d3.max(temp[i], function (d) {
                            return d.value;
                        });
                    }

                    var allAxis = (d[0].map(function (i, j) { return i.property }));
                    var total = allAxis.length;
                    var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
                    var Format = d3.format('%');

                    var g = d3.select(id)
                        .append("svg")
                        .attr("width", cfg.w + cfg.ExtraWidthX)
                        .attr("height", cfg.h + cfg.ExtraWidthY)
                        .append("g")
                        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");


                    //Circular segments
                    for (var j = 0; j < cfg.levels; j++) {
                        var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
                        g.selectAll(".levels")
                            .data(allAxis)
                            .enter()
                            .append("svg:line")
                            .attr("x1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
                            .attr("y1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
                            .attr("x2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total)); })
                            .attr("y2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total)); })
                            .attr("class", "line")
                            .style("stroke", "grey")
                            .style("stroke-opacity", "0.75")
                            .style("stroke-width", "0.3px")
                            .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
                    }

                    //Text indicating at what % each level is
                    // for (var j = 0; j < cfg.levels; j++) {
                    //     var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
                    //     g.selectAll(".levels")
                    //         .data([1])
                    //         .enter()
                    //         .append("svg:text")
                    //         .attr("x", function (d) { return levelFactor * (1 - cfg.factor * Math.sin(0)); })
                    //         .attr("y", function (d) { return levelFactor * (1 - cfg.factor * Math.cos(0)); })
                    //         .attr("class", "legend")
                    //         .style("font-family", "sans-serif")
                    //         .style("font-size", "10px")
                    //         .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
                    //         .attr("fill", "#737373")
                    //         .text((j + 1) * 100 / cfg.levels);
                    // }

                    var series = 0;

                    var axis = g.selectAll(".axis")
                        .data(allAxis)
                        .enter()
                        .append("g")
                        .attr("class", "axis");

                    axis.append("line")
                        .attr("x1", cfg.w / 2)
                        .attr("y1", cfg.h / 2)
                        .attr("x2", function (d, i) { return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
                        .attr("y2", function (d, i) { return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
                        .attr("class", "line")
                        .style("stroke", "grey")
                        .style("stroke-width", "1px");

                    axis.append("text")
                        .attr("class", "legend")
                        .text(function (d) { return d })
                        .style("font-family", "sans-serif")
                        .style("font-size", "11px")
                        .attr("text-anchor", "middle")
                        .attr("dy", "1.5em")
                        .attr("transform", function (d, i) { return "translate(0, -10)" })
                        .attr("x", function (d, i) { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); })
                        .attr("y", function (d, i) { return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total); });

                    var dataValues = [];
                    d.forEach(function (y, x) {
                        dataValues = [];
                        g.selectAll(".nodes")
                            .data(y, function (j, i) {
                                dataValues.push([
                                    cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue[i]) * cfg.factor * Math.sin(i * cfg.radians / total)),
                                    cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue[i]) * cfg.factor * Math.cos(i * cfg.radians / total))
                                ]);
                            });
                        dataValues.push(dataValues[0]);
                        var addToHtmlTemp = "";
                        data[0].forEach(function (element) {
                            addToHtmlTemp += element.property + ":" + numberWithCommas(Math.ceil(element.value)) + "<br/>"
                        });
                        g.selectAll(".property")
                            .data([dataValues])
                            .enter()
                            .append("polygon")
                            .attr("class", "radar-chart-serie" + series)
                            .style("stroke-width", "2px")
                            .style("stroke", cfg.color(series))
                            .attr("points", function (d) {
                                var str = "";
                                for (var pti = 0; pti < d.length; pti++) {
                                    str = str + d[pti][0] + "," + d[pti][1] + " ";
                                }
                                return str;
                            })
                            .style("fill", function (j, i) { return cfg.color(series) })
                            .style("fill-opacity", cfg.opacityArea)
                            .on('mouseover', function (d) {
                                tooltip.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                tooltip.style("display", "block");
                                tooltip.html(polygonName + "<br/>" +
                                    addToHtmlTemp)
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");

                                var z = "polygon." + d3.select(this).attr("class");
                                g.selectAll("polygon")
                                    .transition(200)
                                    .style("fill-opacity", 0.1);
                                g.selectAll(z)
                                    .transition(200)
                                    .style("fill-opacity", .7);
                            })
                            .on('mouseout', function () {
                                tooltip.style("display", "none");
                                g.selectAll("polygon")
                                    .transition(200)
                                    .style("fill-opacity", cfg.opacityArea);
                            });
                        series++;
                    });
                    series = 0;

                    dataValues = [];
                    d.forEach(function (y, x) {
                        g.selectAll(".nodes")
                            .data(y).enter()
                            .append("svg:circle")
                            .attr("class", "radar-chart-serie" + series)
                            .attr('r', cfg.radius)
                            .attr("alt", function (j) { return Math.max(j.value, 0) })
                            .attr("cx", function (j, i) {
                                dataValues.push([
                                    cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue[i]) * cfg.factor * Math.sin(i * cfg.radians / total)),
                                    cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue[i]) * cfg.factor * Math.cos(i * cfg.radians / total))
                                ]);
                                return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue[i]) * cfg.factor * Math.sin(i * cfg.radians / total));
                            })
                            .attr("cy", function (j, i) {
                                return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue[i]) * cfg.factor * Math.cos(i * cfg.radians / total));
                            })
                            .attr("data-id", function (j) { return j.property })
                            .style("fill", "#fff")
                            .style("stroke-width", "2px")
                            .style("stroke", cfg.color(series)).style("fill-opacity", .9)
                            .on('mouseover', function (d) {
                                console.log(d.property);
                            })
                            .on("mouseout", function (d) { tooltip.style("display", "none"); });

                        series++;
                    });
                }
            };

            //Call function to draw the Radar chart
            chartData.forEach(function (element, index) {
                RadarChart.draw("#RadialGraph", [element], polygonName[index])
            });
            // RadarChart.draw("#RadialGraph", chartData);
        },
        hide: function () {

            d3.select(radialGraphElem).selectAll("svg").remove();
            if (radialGraphElem != null) {
                if (!radialGraphElem.classList.contains("invisible")) {
                    radialGraphElem.classList.add("invisible");
                }
            }
        },
        show: function () {
            if (radialGraphElem != null) {
                if (radialGraphElem.classList.contains("invisible")) {
                    radialGraphElem.classList.remove("invisible");
                }
            }
        },
        // attachControls: function () {
        //     // control buttons attachment
        //     // varies depending on the type of the barchart

        //     ctrlHTMLElem = $("<div class='countriesControl'></div>").appendTo(radialGraphElem);
        //     var jdiv = (ctrlHTMLElem); // holds the div to which control belongs
        //     var form; // holds form element

        //     var sortCtrl = ($("<input type='checkbox'>"))
        //         .appendTo(($("<label>Sort values</label>"))
        //             .appendTo(jdiv));

        //     if (sorted) {
        //         sortCtrl.prop("checked", true);
        //     }
        //     // attach sort for both types

        //     sortCtrl.on('change', function (e) {
        //         if (this.checked) {
        //             sorted = true;
        //         } else {
        //             sorted = false;
        //         }
        //         RadialAxisHandler.resetChartData();
        //         RadialAxisHandler.redraw();
        //     });
        //     // if countries - attach control group (game[0-10]|owners/active/average time/active:owners) 
        //     //                                      radio      radio         
        //     if (type == "countries") {
        //         form = $("<form id='gamesForm'></form>");
        //         var gameIndex = 1; // 1-10
        //         var property = "owners";
        //         // games radio group
        //         for (var i = 1; i <= fileData.games.length; i++) {

        //             var radioBtn = $('<input type="radio" name="games" value=' + (i) + '>' + dictionary["game" + i] + '</br>');
        //             if (i == 1) {
        //                 radioBtn.prop("checked", true);
        //             }
        //             radioBtn.on('change', function (e) {
        //                 gameIndex = this.value;
        //                 propertyParams[0] = "game" + gameIndex + property;
        //                 RadialAxisHandler.resetChartData();
        //                 RadialAxisHandler.redraw();
        //             });
        //             form.append(radioBtn);
        //         }
        //         form.appendTo(jdiv);
        //         // property handler
        //         function updateProperty(e) {
        //             property = this.value;
        //             propertyParams[0] = "game" + gameIndex + property;
        //             RadialAxisHandler.resetChartData();
        //             RadialAxisHandler.redraw();
        //         }
        //         form = $("<form id='propertyForm'></form>");
        //         // owners
        //         radioBtn = $('<input type="radio" name="propertyForm" value="owners">Owners</br>');
        //         radioBtn.on('change', updateProperty);
        //         radioBtn.prop("checked", true);
        //         form.append(radioBtn);
        //         // active
        //         radioBtn = $('<input type="radio" name="propertyForm" value="active_users">Active Users</br>');
        //         radioBtn.on('change', updateProperty);
        //         form.append(radioBtn);
        //         // average playtime
        //         radioBtn = $('<input type="radio" name="propertyForm" value="avg_play_time">Average Playtime</br>');
        //         radioBtn.on('change', updateProperty);
        //         form.append(radioBtn);
        //         // active users to owners relation
        //         // radioBtn = $('<input type="radio" name="propertyForm">Active Users : Owners</br>');
        //         // radioBtn.on('change', function (e) {
        //         //     propertyParams[0] = "game" + gameIndex + "active_users";
        //         //     propertyParams[1] = "game" + gameIndex + "owners";
        //         // });
        //         // form.append(radioBtn);  
        //         form.appendTo(jdiv);

        //     }
        //     // if games - attach control group (owners/active/average playtime/active:owners)
        //     //                                  radio
        //     else if (type == "games") {
        //         var property = "owners";
        //         function updateProperty(e) {
        //             property = this.value;
        //             propertyParams[0] = property;
        //             RadialAxisHandler.resetChartData();
        //             RadialAxisHandler.redraw();
        //         }
        //         form = $("<form id='propertyForm'></form>");
        //         // owners
        //         radioBtn = $('<input type="radio" name="propertyForm" value="owners">Owners</br>');
        //         radioBtn.on('change', updateProperty);
        //         radioBtn.prop("checked", true);
        //         form.append(radioBtn);
        //         // active
        //         radioBtn = $('<input type="radio" name="propertyForm" value="active_users">Active Users</br>');
        //         radioBtn.on('change', updateProperty);
        //         form.append(radioBtn);
        //         // average playtime
        //         radioBtn = $('<input type="radio" name="propertyForm" value="avg_play_time">Average Playtime</br>');
        //         radioBtn.on('change', updateProperty);
        //         form.append(radioBtn);
        //         form.appendTo(jdiv);
        //     }


        // },
        // detachControls: function () {
        //     // control buttons detachment
        //     $(ctrlHTMLElem).remove();
        // },
        start: function (parameters) {
            RadialAxisHandler.stop();
            type = parameters.type;
            propertyParams = parameters.properties;
            tooltip = d3.select("body").append("div").attr("class", "toolTip").style("opacity", 0);
            radialGraphElem = document.getElementById("RadialGraph");
            RadialAxisHandler.resetChartData();
            RadialAxisHandler.redraw();
            // RadialAxisHandler.attachControls();
            window.addEventListener("resize", RadialAxisHandler.redraw);
        },
        stop: function () {
            window.removeEventListener("resize", RadialAxisHandler.redraw);
            // RadialAxisHandler.detachControls();
            RadialAxisHandler.hide();
            $(tooltip).remove();
        }
    };
}());

var LineGraphHandler = (function () {
    var type;
    var propertyParams; // in case of games its a suffix and 
    var graphElem = document.getElementById("lineGraph");
    var ctrlHTMLElem;
    var chartData = new Array();
    var polygonName = new Array();
    var margin = { top: 10, right: 20, bottom: 20, left: 100 }
    var tooltipdiv;
    var width;
    var height;
    var svg = d3.select(graphElem).append("svg");
    var scatter = false;
    var labelWidth = 0;
    var color;
    var legenddiv;

    return {
        // resets chartData, containing array/s with the data specifically for the current barchart parameters
        resetChartData: function () {
            if (type == "economy") {
                // economy / income_grp, name ,  money_spent , gdp_md_est
                var nestedData = d3.nest()
                    .key(function (d) { return d.properties[propertyParams[0]]; })
                    .entries(fileData.features);

                nestedData.sort(function (a, b) {
                    var keyA = a.key.toUpperCase(); // ignore upper and lowercase
                    var keyB = b.key.toUpperCase(); // ignore upper and lowercase
                    if (keyA < keyB) {
                        return -1;
                    }
                    if (keyA > keyB) {
                        return 1;
                    }
                    // names must be equal
                    return 0;
                })

                nestedData.forEach(function (d) {
                    d.values.sort(function (a, b) {
                        return a.properties.gdp_md_est - b.properties.gdp_md_est;
                    });
                });
                chartData = nestedData;
            }
        },
        getData: function () {
            return chartData;
        },
        redraw: function () {
            LineGraphHandler.show();
            // clear previous svg 
            // svg.selectAll("*").remove(); // this may work
            d3.select(graphElem).selectAll("svg").remove();
            // if resize happened - need to recalc 'width' and 'height'
            width = (0.9) * ((graphElem).clientWidth) - margin.left - margin.right;
            height = (0.9) * ((graphElem).clientHeight) - margin.top - margin.bottom;
            // and recalc the X and Y functions, which depend on 'width' and 'height'
            // position the canvas
            svg = d3.select(graphElem).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // LineGraph from here !!!!!!

            // Set the ranges
            var x = d3.scalePow()
                .exponent(0.4)
                .range([0, width]);
            var y = d3.scalePow()
                .exponent(0.5)
                .range([height, 0]);

            // Define the axes
            var xAxis = d3.axisBottom(x);
            var yAxis = d3.axisLeft(y);

            // Define the line
            var priceline = d3.line()
                .x(function (d) { return x(d.properties.gdp_md_est); })
                .y(function (d) { return y(d.properties.money_spent); });

            // var line = d3.line()
            //     .x(function (d, i) { return xScale(i); }) // set the x values for the line generator
            //     .y(function (d) { return yScale(d.y); }) // set the y values for the line generator 
            //     .curve(d3.curveMonotoneX) // apply smoothing to the line

            // Scale the range of the data
            x.domain(d3.extent(fileData.features, function (d) { return d.properties.gdp_md_est; }));
            y.domain([0, d3.max(fileData.features, function (d) { return d.properties.money_spent; })]);

            color = d3.scaleOrdinal(d3.schemeCategory10);  // set the colour scale

            if (legenddiv != null) {
                $(legenddiv).remove();
            }


            legenddiv = $("<div class='legend'></div>");
            var html = "";
            for (var i = 0; i < chartData.length; i++) {
                html +=
                    '<svg id="category' + i + '" width="10" height="10"><rect width="10" height="10"style="fill:' + color(chartData[i].key) + ';stroke-width:1;stroke:rgb(0,0,0)"/></svg> ' +
                    chartData[i].key + '<br>';
            }
            legenddiv.html(html);
            legenddiv.appendTo(ctrlHTMLElem);

            // Loop through each category (key)
            chartData.forEach(function (d) {
                if (!scatter) {
                    svg.append("path")
                        .attr("class", "line")
                        .style("stroke", function () { // Add dynamically
                            return d.color = color(d.key);
                        })
                        .attr("d", priceline(d.values));
                }
                var col = color(d.key);
                svg.selectAll("dot")
                    .data(d.values)
                    .enter().append("circle")
                    .attr("r", 2)
                    .attr("cx", function (d) { return x(d.properties.gdp_md_est); })
                    .attr("cy", function (d) { return y(d.properties.money_spent); })
                    .style("fill", col)
                    .on("mouseover", function (d) {
                        tooltipdiv.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltipdiv.html("Country: " + d.properties.name + "<br>" + "GDP :" + numberWithCommas(d.properties.gdp_md_est) + "<br>" + "Money Spent :" + numberWithCommas(d.properties.money_spent))
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function (d) {
                        tooltipdiv.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            });

            tooltipdiv = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);


            // Add the X Axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis.ticks(4));


            // Add the Y Axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis.ticks(10));

            // text label for the x axis
            svg.append("text")
                .attr("transform",
                "translate(" + (width - 60) + " ," +
                (height - 30) + ")")
                .attr("dy", "2em")
                .style("text-anchor", "middle")
                .text("Estimated GDP (millions USD)");

            // text label for the y axis
            svg.append("text")
                .attr("y", 5)
                .attr("x", -50)
                .attr("transform", "rotate(-90)")
                .attr("dy", "2em")
                .style("text-anchor", "middle")
                .text("Money Spent (USD)");
        },
        hide: function () {

            d3.select(graphElem).selectAll("svg").remove();
            if (graphElem != null) {
                if (!graphElem.classList.contains("invisible")) {
                    graphElem.classList.add("invisible");
                }
            }
        },
        show: function () {
            if (graphElem != null) {
                if (graphElem.classList.contains("invisible")) {
                    graphElem.classList.remove("invisible");
                }
            }
        },
        attachControls: function () {
            // control buttons attachment
            // varies depending on the type of the barchart

            ctrlHTMLElem = $("<div class='countriesControl'></div>").appendTo(graphElem);
            var jdiv = (ctrlHTMLElem); // holds the div to which control belongs
            var form; // holds form element
            var radioBtn;

            // if countries - attach control group (game[0-10]|owners/active/average time/active:owners) 
            //                                      radio      radio         
            if (type == "economy") {
                form = $("<form id='gamesForm'></form>");

                var scatterCheckbox = ($("<input type='checkbox'>"))
                    .appendTo(($("<label>Scatterplot</label>"))
                        .appendTo(jdiv));

                if (scatter) {
                    scatterCheckbox.prop("checked", true);
                }
                // attach sort for both types

                scatterCheckbox.on('change', function (e) {
                    if (this.checked) {
                        scatter = true;
                    } else {
                        scatter = false;
                    }
                    // LineGraphHandler.resetChartData();
                    LineGraphHandler.redraw();
                });

                // property handler
                function updateProperty(e) {
                    propertyParams[0] = this.value;
                    LineGraphHandler.resetChartData();
                    LineGraphHandler.redraw();
                }
                form = $("<form id='propertyForm'></form>");
                // Economy
                radioBtn = $('<input type="radio" name="propertyForm" value="economy">Economy levels</br>');
                radioBtn.on('change', updateProperty);
                radioBtn.prop("checked", true);
                form.append(radioBtn);
                // Income
                radioBtn = $('<input type="radio" name="propertyForm" value="income_grp">Income Groups</br>');
                radioBtn.on('change', updateProperty);
                form.append(radioBtn);
                // Continents 
                radioBtn = $('<input type="radio" name="propertyForm" value="continent">Continents</br>');
                radioBtn.on('change', updateProperty);
                form.append(radioBtn);

                form.appendTo(jdiv);


            }
        },
        detachControls: function () {
            $(ctrlHTMLElem).remove();
        },
        startSBC: function (parameters) {
            LineGraphHandler.stopSBC();
            tooltipdiv = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            type = parameters.type;
            propertyParams = parameters.properties;
            graphElem = document.getElementById("lineGraph");
            LineGraphHandler.resetChartData();
            LineGraphHandler.attachControls();
            LineGraphHandler.redraw();
            window.addEventListener("resize", LineGraphHandler.redraw);
        },
        stopSBC: function () {
            window.removeEventListener("resize", LineGraphHandler.redraw);
            LineGraphHandler.detachControls();
            LineGraphHandler.hide();
            $(tooltipdiv).remove();
        }
    };
}());

var ParallelCoordinateHandler = (function () {
    var type;
    var propertyParams; // in case of games its a suffix and 
    var parallelGraphHTMLElem = document.getElementById("parallelCoordinates");
    // var ctrlHTMLElem;
    var chartData = new Array();
    var margin = { top: 50, right: 50, bottom: 50, left: 50 }
    var width;
    var height;
    var svg;
    var labelWidth = 0;
    var color;
    // var sorted = false;
    return {
        // resets chartData, containing array/s with the data specifically for the current barchart parameters
        resetChartData: function () {
            // gdp, economy, income, moneyspent
            for (var i = 0; i < fileData.features.length; i++) {
                var curFeature = fileData.features[i].properties;
                var economy = 7 - parseInt(curFeature.economy.charAt(0));
                var gdp_md_est = curFeature.gdp_md_est;
                var income_grp = 5 - parseInt(curFeature.income_grp.charAt(0));
                var money_spent = curFeature.money_spent;
                chartData[i] =
                    {
                        "economy": economy,
                        "gdp_md_est": gdp_md_est,
                        "income_grp": income_grp,
                        "money_spent": money_spent
                    };
            }
            color = d3.scaleOrdinal(d3.schemeCategory10);
        },
        getData: function () {

        },
        redraw: function () {
            ParallelCoordinateHandler.show();
            // clear previous svg 
            d3.select(parallelGraphHTMLElem).selectAll("svg").remove();
            width = ((parallelGraphHTMLElem).clientWidth) - margin.left - margin.right;
            height = ((parallelGraphHTMLElem).clientHeight) - margin.top - margin.bottom;

            var x = d3.scalePoint().range([0, width]),
                y = {},
                dragging = {};

            var line = d3.line(),
                axis = d3.axisLeft(),
                background,
                foreground;

            var svg = d3.select(parallelGraphHTMLElem).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var dimensions = d3.keys(chartData[0]).filter(function (d) {
                if(d == "gdp_md_est"){
                    (y[d] = d3.scalePow()
                    .exponent(0.4)
                    .domain(d3.extent(chartData, function (p) { return +p[d]; }))
                    .range([height, 0]));    
                    return d != "name" && (y[d]);
                } else if(d == "money_spent"){
                    (y[d] = d3.scalePow()
                    .exponent(0.5)
                    .domain(d3.extent(chartData, function (p) { return +p[d]; }))
                    .range([height, 0]));    
                    return d != "name" && (y[d]);
                } else{
                    (y[d] = d3.scaleLinear()
                    .domain(d3.extent(chartData, function (p) { return +p[d]; }))
                    .range([height, 0]));    
                    return d != "name" && (y[d]);
                }
            });

            // Extract the list of dimensions and create a scale for each.
            x.domain(dimensions);

            // Add grey background lines for context.
            background = svg.append("g")
                .attr("class", "background")
                .selectAll("path")
                .data(chartData)
                .enter().append("path")
                .attr("d", path);

            // Add blue foreground lines for focus.
            foreground = svg.append("g")
                .attr("class", "foreground")
                .selectAll("path")
                .data(chartData)
                .enter().append("path")
                .attr("d", path)
                .style("stroke", function (d) { // Add dynamically
                    return d.color = color(d.income_grp);
                });

            // Add a group element for each dimension.
            var g = svg.selectAll(".dimensions")
                .data(dimensions)
                .enter().append("g")
                .attr("class", "dimensions")
                .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
                .call(d3.drag()
                    .subject(function (d) { return { x: x(d) }; })
                    .on("start", function (d) {
                        dragging[d] = x(d);
                        background.attr("visibility", "hidden");
                    })
                    .on("drag", function (d) {
                        dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                        foreground.attr("d", path);
                        dimensions.sort(function (a, b) { return position(a) - position(b); });
                        x.domain(dimensions);
                        g.attr("transform", function (d) { return "translate(" + position(d) + ")"; })
                    })
                    .on("end", function (d) {
                        delete dragging[d];
                        transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                        transition(foreground).attr("d", path);
                        background
                            .attr("d", path)
                            .transition()
                            .delay(500)
                            .duration(0)
                            .attr("visibility", null);
                    }));

            // Add an axis and title.
            g.append("g")
                .attr("class", "axis")
                .each(function (d) { d3.select(this).call(axis.scale(y[d])); })
                .append("svg:text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function (d) { return d; });


            function position(d) {
                var v = dragging[d];
                return v == null ? x(d) : v;
            }

            function transition(g) {
                return g.transition().duration(500);
            }

            // Returns the path for a given data point.
            function path(d) {
                return line(dimensions.map(function (p) { return [position(p), y[p](d[p])]; }));
            }

        },
        hide: function () {
            if (parallelGraphHTMLElem != null) {

                if (!parallelGraphHTMLElem.classList.contains("invisible")) {
                    parallelGraphHTMLElem.classList.add("invisible");
                }
            }
        },
        show: function () {
            if (parallelGraphHTMLElem != null) {
                if (parallelGraphHTMLElem.classList.contains("invisible")) {
                    parallelGraphHTMLElem.classList.remove("invisible");
                }
            }
        },
        start: function (parameters) {
            ParallelCoordinateHandler.stop();
            type = parameters.type;
            propertyParams = parameters.properties;
            parallelGraphHTMLElem = document.getElementById("parallelCoordinates");
            ParallelCoordinateHandler.resetChartData();
            ParallelCoordinateHandler.redraw();
            window.addEventListener("resize", ParallelCoordinateHandler.redraw);
        },
        stop: function () {
            ParallelCoordinateHandler.hide();
            window.removeEventListener("resize", ParallelCoordinateHandler.redraw);
        }
    };
}());