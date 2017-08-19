$(document).ready(function(){
    $('button').click(function(){
        $('.sidebar').toggleClass('fliph');
    });
   
   
    
 });

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
 
 var fileData;
 
 // A $( document ).ready() block.
 $(document).ready(function () {
     console.log("ready!");
 
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
                 showFiles = function (files) {
                     label.textContent = files.length > 1 ? (input.getAttribute('data-multiple-caption') || '').replace('{count}', files.length) : files[0].name;
                 },
                 triggerFormSubmit = function () {
                     var event = document.createEvent('HTMLEvents');
                     event.initEvent('submit', true, false);
                     form.dispatchEvent(event);
                 };
 
             // automatically submit the form on file select
             Handler.addListener(input, 'change', function (e) {
                 showFiles(e.target.files);
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
                     console.log(Handler.listeners);
                 });
                 Handler.addListener(form, 'drop', function (e) {
                     droppedFiles = e.dataTransfer.files; // the files that were dropped
                     showFiles(droppedFiles);
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
                 event.preventDefault();
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
 var currentProperty = "pop_est";
 function pickForCurrentProperty(d) {
     return d.properties[currentProperty];
 }
 
 var dictionary = {
     "all_num_active": "Active players worldwide",
     "all_num_owners": "Game owners worldwide",
     "avg_play_time": "Average playtime worldwide",
     "continent": "Continent",
     "country_active": "Active players in country",
     "country_owners": "Game owners in country",
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
     "game5excessive_users": "Skyrim | Excessive gamers " ,
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
 
 function setUpHomeScreen() {
     // first set up the screen and hide the DNDbox 
     $("#DND").fadeOut("slow");
     //also remove all it's eventListeners
     Handler.removeAllListeners();
     //craete the nav bar buttons
     
     var  tempFunc = function (){
         console.log("info");
     }
 
     var btnGroup = $("nav").append("<div class='btn-group-vertical' role='group'></div>");
 
     btnGroup.append(createButton("button", "info1", "btn btn-info onTop", tempFunc));
     btnGroup.append(createButton("button", "info2", "btn btn-info onTop", tempFunc));
     btnGroup.append(createButton("button", "info3", "btn btn-info onTop", tempFunc));
     // btnGroup.append(createButton("button", "info", "btn btn-info onTop col align-self-center", tempFunc));
     // btnGroup.append(createButton("button", "info", "btn btn-info onTop col align-self-center", tempFunc));
     // btnGroup.append(createButton("button", "info", "btn btn-info onTop col align-self-center", tempFunc));
     
 
 
     // <button type="button" class="btn btn-primary">Primary</button>
     // <button type="button" class="btn btn-secondary">Secondary</button>
     // <button type="button" class="btn btn-success">Success</button>
     // <button type="button" class="btn btn-danger">Danger</button>
     // <button type="button" class="btn btn-warning">Warning</button>
     // <button type="button" class="btn btn-info">Info</button>
     // <button type="button" class="btn btn-light">Light</button>
     // <button type="button" class="btn btn-dark">Dark</button>
     //add button listener via Handler
 
     //then show a navbar to the user where the DNDbox was placed instead
 
     //accordung to the subject that was clicked change View
 
     // according to the view visualize the data
     visualize();
 }
 var btnText ={
     "info" : "Information",
     "map" : "ColorplathMap"
 };
  
 /**
 * create a button with the specified id and classes 
  * and attach an onClick listener with the parameter function  
  * @param {String} id 
  * @param {String} classes 
  * @param {Function} onClickFunction 
  * @returns 
  */
 function createButton(type, id, classes, onClickFunction) {
     var btn = $('<button/>', {
         text: id, //set text 1 to 10
         id: id,
         type : type,
         click: onClickFunction
     });
     btn.a
     return btn;
 };
 
 
 
 
 function visualize() {
 
     Handler.removeAllListeners();
     $("#DND").fadeOut("slow");
 
     var map = L.map('mapid');
     map.createPane('labels');
     map.getPane('labels').style.zIndex = 650;
     map.getPane('labels').style.pointerEvents = 'none';
 
     // var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
     //     attribution: '©OpenStreetMap, ©CartoDB'
     // }).addTo(map);
 
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
             :'Hover over a country </br>'+ 
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
 
     // var propertyCtrl = L.control({ position: 'bottomleft' });
     // propertyCtrl.onAdd = function (map) {
     //     var div = L.DomUtil.create('div', 'info propertyCtrl');
 
     //     var jdiv = $(div);
     //     var form = $("<form></form>");
 
     //     if (fileData.features.length > 1) {
     //         var props = Object.keys(fileData.features[0].properties);
     //         props.sort();
 
     //         for (var i = 0; i < props.length; i++) {
     //             var radioBtn = $('<input type="radio" name="property_"' + props[i] + '" value=' + props[i] + ' />');
     //             radioBtn.on('change', function (e) {
     //                 console.log(this.value);
     //                 currentProperty = this.value;
     //                 updateMap();
     //             });
     //             form.append(radioBtn);
     //         }
 
     //         jdiv.append(form);
     //     }
 
     //     return jdiv[0];
     // }
     // propertyCtrl.addTo(map);
 
     function updateMap() {
         regenColor();
         info.update();
         legend.update();
         geojson.eachLayer(function (layer) {
             geojson.resetStyle(layer);
         });
     }
 };
 
 
 