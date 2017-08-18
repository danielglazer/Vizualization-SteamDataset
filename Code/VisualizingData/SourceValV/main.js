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
            // input.addEventListener('change', function (e) {
            //     showFiles(e.target.files);
            //     droppedFiles = e.target.files;
            //     triggerFormSubmit();
            // });

            // drag&drop files if the feature is available
            if (isAdvancedUpload) {
                form.classList.add('has-advanced-upload'); // letting the CSS part to know drag&drop is supported by the browser

                ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
                    Handler.addListener(form, event, function (e) {
                        // preventing the unwanted behaviours
                        e.preventDefault();
                        e.stopPropagation();
                    }, false);
                    // form.addEventListener(event, function (e) {
                    //     // preventing the unwanted behaviours
                    //     e.preventDefault();
                    //     e.stopPropagation();
                    // });
                });
                ['dragover', 'dragenter'].forEach(function (event) {
                    Handler.addListener(form, event, function () {
                        form.classList.add('is-dragover');
                    }, false);
                    // form.addEventListener(event, function () {
                    //     form.classList.add('is-dragover');
                    // });
                });
                ['dragleave', 'dragend', 'drop'].forEach(function (event) {
                    Handler.addListener(form, event, function () {
                        form.classList.remove('is-dragover');
                    }, false);
                    console.log(Handler.listeners);
                    // form.addEventListener(event, function () {
                    //     form.classList.remove('is-dragover');
                    // });
                });
                Handler.addListener(form, 'drop', function (e) {
                    droppedFiles = e.dataTransfer.files; // the files that were dropped
                    showFiles(droppedFiles);
                    triggerFormSubmit();

                }, false);
                // form.addEventListener('drop', function (e) {
                //     droppedFiles = e.dataTransfer.files; // the files that were dropped
                //     showFiles(droppedFiles);
                //     triggerFormSubmit();

                // });
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
                        visualize();
                    }
                };

                reader.readAsText(droppedFiles[0]);
                event.preventDefault();
            }, false);

            // form.addEventListener('submit', function (e) {
            //     // preventing the duplicate submissions if the current one is in progress
            //     if (form.classList.contains('is-uploading')) return false;

            //     form.classList.add('is-uploading');
            //     form.classList.remove('is-error');

            //     var reader = new FileReader();
            //     reader.onloadend = function () {
            //         form.classList.remove('is-uploading');
            //         var data = validateJSON(this.result);
            //         form.classList.add(isSuccess(data) == true ? 'is-success' : 'is-error');
            //         if(isSuccess(data)){
            //             console.log(data);
            //             fileData = data;
            //             visualize();
            //         }
            //     };

            //     reader.readAsText(droppedFiles[0]);
            //     event.preventDefault();
            // });


            // restart the form if has a state of error/success
            Array.prototype.forEach.call(restart, function (entry) {
                Handler.addListener(entry, 'click', function (e) {
                    e.preventDefault();
                    form.classList.remove('is-error', 'is-success');
                    input.click();
                }, false);

                // entry.addEventListener('click', function (e) {
                //     e.preventDefault();
                //     form.classList.remove('is-error', 'is-success');
                //     input.click();
                // });
            });

            // Firefox focus bug fix for file input
            Handler.addListener(input, 'focus', function () { input.classList.add('has-focus'); }, false);
            Handler.addListener(input, 'blur', function () { input.classList.remove('has-focus'); }, false);
            // input.addEventListener('focus', function () { input.classList.add('has-focus'); });
            // input.addEventListener('blur', function () { input.classList.remove('has-focus'); });
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

var currentProperty = "pop_est";
function pickForCurrentProperty(d) {
    return d.properties[currentProperty];
}

function translate_to_UI(property_name) {

}

function visualize() {

    Handler.removeAllListeners();

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

    var color = d3.scaleLinear().domain([1, d3.max(fileData.features, function (d) {
        return pickForCurrentProperty(d)
    }
    )])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#f7fbff"), d3.rgb('#08306b')]);

    function style(feature) {
        return {
            fillColor: color([pickForCurrentProperty(feature)]),
            weight: 2,
            opacity: 1,
            color: 'black',
            dashArray: '3',
            fillOpacity: 0.9
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
            '<b>' + currentProperty + '</b><br />' +
            '<svg width="10" height="10"><rect width="10" height="10"style="fill:' + color(pickForCurrentProperty(feature)) + ';stroke-width:1;stroke:rgb(0,0,0)"/></svg> ' +
            pickForCurrentProperty(feature) + '<br />'
            : 'Hover over a country');
    };

    info.addTo(map);

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

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    var geojson = L.geoJson(fileData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    geojson.eachLayer(function (layer) {
        layer.bindPopup(layer.feature.properties.name);
    });

    map.fitBounds(geojson.getBounds());
    var southWest = L.latLng(-89.98155760646617, -180),
        northEast = L.latLng(89.99346179538875, 180);
    var bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds);
    map.on('drag', function () {
        map.panInsideBounds(bounds, { animate: false });
    });
    map.setMinZoom(2);
    map.setMaxZoom(4);

};