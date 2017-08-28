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

function getTime(minutes) {
    return Math.floor(minutes / 60) + " : " + (minutes % 60);
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
    Handler.addListener($("#Continents_TreeMap")[0], "click", continentsTreeMap, false);
    Handler.addListener($("#Continents_Choropleth")[0], "click", continentsChoropleth, false);
    Handler.addListener($("#Continents_Choropleth")[0], "click", continentsRadialAxis, false);
    //About
    Handler.addListener($("#About")[0], "click", about, false);
};

// "Games"' Listeners Handler functions
function gamesChoropleth() {
    console.log(this);
}
function gamesRadialAxis() {
    console.log(this);
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
    console.log(this);
}
function economyRadialAxis() {
    console.log(this);
}
function economyParallelCoordinates() {
    console.log(this);
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
function continentsTreeMap() {
    console.log(this);
}
function continentsChoropleth() {
    console.log(this);
}
function continentsRadialAxis() {
    console.log(this);
}
// "About"'s Listener Handler function
function about() {
    console.log(this);
}
function stopHandlers() {
    BarchartHandler.stopBC();
    StackedBarchartHandler.stopSBC();
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
function choropleth(parameters) {

    currentProperty = parameters.property;

    var map = L.map('mapid');
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

    var color = d3.scaleLinear().domain([0, d3.max(fileData.features, function (d) {
        return pickForCurrentProperty(d)
    })])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#f7fbff"), d3.rgb('#08306b')]);

    function regenColor(color1, color2) {
        if (!color1) {
            color1 = "#f7fbff";
        }
        if (!color2) {
            color2 = '#08306b';
        }
        color = d3.scaleLinear().domain([0, d3.max(fileData.features, function (d) {
            return pickForCurrentProperty(d)
        })])
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb(color1), d3.rgb(color2)]);
    }

    function style(feature) {
        return {
            fillColor: color([pickForCurrentProperty(feature)]),
            weight: 2,
            opacity: 1,
            color: 'black',
            dashArray: '3',
            fillOpacity: 1
        };
    }

    // Info
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (feature) {
        this._div.innerHTML = (feature ?
            '<b>' + feature.properties.name + '</b><br />' +
            '<b>' + dictionary[currentProperty] + '</b><br />' +
            '<svg width="10" height="10"><rect width="10" height="10"style="fill:' + color(pickForCurrentProperty(feature)) + ';stroke-width:1;stroke:rgb(0,0,0)"/></svg> ' +
            numberWithCommas(pickForCurrentProperty(feature)) + '<br />'
            : 'Hover over a country </br>' +
            '<b>' + dictionary[currentProperty] + '</b><br />');
    };
    info.addTo(map);

    // mouseon listener
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 1
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        info.update(layer.feature);
    }
    // mouseout listener
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }
    // zoom on click
    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }
    // highlighting the country, listeners assigment
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }
    // geojson binding
    var geojson = L.geoJson(fileData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    // pop-up dialog
    geojson.eachLayer(function (layer) {
        layer.bindPopup(layer.feature.properties.name);
    });

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

    // legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info legend')
        legend.update();
        return this._div;
    };
    legend.update = function () {
        var max = d3.max(fileData.features, function (d) {
            return pickForCurrentProperty(d)
        });
        var grades = [0, Math.floor((1 / 4) * max), Math.floor((2 / 4) * max), Math.floor((3 / 4) * max), Math.floor(max)],
            labels = [];
        this._div.innerHTML = "";
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            this._div.innerHTML +=
                // '<i style="background:' + color(grades[i]) + '"></i> ' +
                '<svg width="10" height="10"><rect width="10" height="10"style="fill:' + color(grades[i]) + ';stroke-width:1;stroke:rgb(0,0,0)"/></svg> ' +
                numberWithCommas(grades[i]) + '<br>';
        }
    }
    legend.addTo(map);

    function updateMap() {
        regenColor();
        info.update();
        legend.update();
        geojson.eachLayer(function (layer) {
            geojson.resetStyle(layer);
        });
    }
};

function pickForCountry() {

}

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
    var fixedBarHeight = false;
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
            else if (type == "games") {
                // TODO Unused
            }
        },
        getXfunc: function () {
            var data = BarchartHandler.getData();
            if (propertyParams.length == 2) {
                return d3.scaleLinear()
                    .domain([0, 1])
                    .range([0, width - labelWidth]);
            }
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
                        tooltipdiv.html(d.key + "<br/>" + getTime(d.value))
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
                        return (numberWithCommas(d.value));
                    })
                    .attr("x", function (d) {
                        var width = this.getBBox().width;
                        return Math.max(width, x(d.value));
                    });
            }
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + (labelWidth + margin.left) + "," + height + ")")
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
            BarchartHandler.resetChartData();
            BarchartHandler.redraw();
            BarchartHandler.attachControls();
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
    var fixedBarHeight = false;
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
                            chartData[t][i - 1].value = games[t][i - 1];
                        }
                    }

                }
            }

            var transposedChartData = transposeArray(chartData);
            if (sorted) {
                transposedChartData.sort(function (a, b) {
                    var valueA = a[types.length - 1].value[1]; // ignore upper and lowercase
                    var valueB = b[types.length - 1].value[1]; // ignore upper and lowercase
                    return valueA - valueB;
                });
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

            fixedBarHeightCtrl.on('click', function (e) {
                if (this.checked) {
                    fixedBarHeight = true;
                } else {
                    fixedBarHeight = false;
                }
                StackedBarchartHandler.resetChartData();
                StackedBarchartHandler.redraw();
            });


            // if countries - attach control group (game[0-10]|owners/active/average time/active:owners) 
            //                                      radio      radio         
            if (type == "games") {
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
            }

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
            StackedBarchartHandler.resetChartData();
            StackedBarchartHandler.redraw();
            StackedBarchartHandler.attachControls();
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