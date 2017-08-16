'use strict';

// remove this if you use Modernizr 
(function (e, t, n) {
    var r = e.querySelectorAll("html")[0];
    r.className = r.className.replace(/(^|\s)no-js(\s|$)/, "$1js$2")
})(document, window, 0);

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
            input.addEventListener('change', function (e) {
                showFiles(e.target.files);
                triggerFormSubmit();
            });

            // drag&drop files if the feature is available
            if (isAdvancedUpload) {
                form.classList.add('has-advanced-upload'); // letting the CSS part to know drag&drop is supported by the browser

                ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
                    form.addEventListener(event, function (e) {
                        // preventing the unwanted behaviours
                        e.preventDefault();
                        e.stopPropagation();
                    });
                });
                ['dragover', 'dragenter'].forEach(function (event) {
                    form.addEventListener(event, function () {
                        form.classList.add('is-dragover');
                    });
                });
                ['dragleave', 'dragend', 'drop'].forEach(function (event) {
                    form.addEventListener(event, function () {
                        form.classList.remove('is-dragover');
                    });
                });
                form.addEventListener('drop', function (e) {
                    droppedFiles = e.dataTransfer.files; // the files that were dropped
                    showFiles(droppedFiles);
                    triggerFormSubmit();

                });
            }


            // if the form was submitted
            form.addEventListener('submit', function (e) {
                // preventing the duplicate submissions if the current one is in progress
                if (form.classList.contains('is-uploading')) return false;

                form.classList.add('is-uploading');
                form.classList.remove('is-error');

                var reader = new FileReader();
                reader.onloadend = function () {
                    form.classList.remove('is-uploading');
                    var data = JSON.parse(this.result);
                    form.classList.add(isSuccess(data) == true ? 'is-success' : 'is-error');
                    console.log(data);
                    fileData = data;
                    visualize();
                };

                reader.readAsText(droppedFiles[0]);
                event.preventDefault();
            });


            // restart the form if has a state of error/success
            Array.prototype.forEach.call(restart, function (entry) {
                entry.addEventListener('click', function (e) {
                    e.preventDefault();
                    form.classList.remove('is-error', 'is-success');
                    input.click();
                });
            });

            // Firefox focus bug fix for file input
            input.addEventListener('focus', function () { input.classList.add('has-focus'); });
            input.addEventListener('blur', function () { input.classList.remove('has-focus'); });
        });

    }(document, window, 0));
});

function isSuccess(data) {
    return data.type == "FeatureCollection";
};

function visualize() {

    var widthScale = d3.scaleLinear()
                    .domain([0, d3.max(fileData.features,function(d)
                        {return d.properties.country_active})])
                    .range([0,400]);                
    console.log(d3.max(fileData.features,function(d)
                    {return d.properties.country_active}));

    var color = d3.scaleLinear()
                .domain([0, d3.max(fileData.features,function(d)
                    {return d.properties.country_active})])
                .range(["green","red"]);

    var canvas = d3.select("main").append("svg")
        .attr("width", 400)
        .attr("height", 400);

    // var group = canvas.selectAll('g')
    //     .data(fileData.features)
    //     .enter()
    //     .append("g");

    var bars = canvas.selectAll("rect")
        .data(fileData.features)
        .enter()
        .append("rect")
        .attr("width",function(d){
            return widthScale(d.properties.country_active) 
        })
        .attr("fill", function(d){
            return color(d.properties.country_active);
        })
        .attr("height", 5)
        .attr("y",function(d,i){
            return i;
         })

    // var projection = d3.geoMercator().scale(1000).translate([0, 500]);

    // var path = d3.geoPath().projection(projection);

    // var areas = group.append("path")
    //     .attr("d", path)
    //     .attr("class", "area")
    //     .attr("fill", "steelblue");
    // console.log("done");

    //     mapboxgl.accessToken = 'pk.eyJ1IjoidmlzdWFsaXphdGlvbiIsImEiOiJjajZldGJhN3AyamRwMnFsczdlZTc1bnV3In0.kWBNVk-R38vQ1mazvFrB6A';
    //     var map = new mapboxgl.Map({
    //     container: 'map',
    //     style: 'mapbox://styles/mapbox/light-v9'
    //     });

    //    var continents = d3.nest()
    //    .key(function(d) { return d.properties.continent;})
    //    .rollup(function(v) { return d3.sum(v, function(d) { return d.properties.country_active; }); })
    //    .entries(fileData.features);
    //    //console.log(continents);
    //     console.log(continents);

    //   var economies = d3.nest()
    //    .key(function(d) { return d.properties.economy;})
    //    .entries(fileData.features);
    //    //console.log(continents);
    //     console.log(economies);

    // var mymap = L.map('mapid').setView([0, 0], 2);

    // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    //     minZoom: 2,    
    //     maxZoom: 4,
    //     id: 'mapbox.streets',
    //     style: 'mapbox://styles/mapbox/light-v9',
    //     accessToken: 'pk.eyJ1IjoidmlzdWFsaXphdGlvbiIsImEiOiJjajZldGJhN3AyamRwMnFsczdlZTc1bnV3In0.kWBNVk-R38vQ1mazvFrB6A'
    //     accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    // }).addTo(mymap);
};