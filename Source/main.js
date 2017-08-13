// A $( document ).ready() block.
$(document).ready(function () {
    console.log("ready!");
    function dropJSON(targetEl, callback) {
        // disable default drag & drop functionality
        targetEl.addEventListener('dragenter', function (e) { e.preventDefault(); });
        targetEl.addEventListener('dragover', function (e) { e.preventDefault(); });

        targetEl.addEventListener('drop', function (event) {

            var reader = new FileReader();
            reader.onloadend = function () {
                var data = JSON.parse(this.result);
                callback(data);
            };

            reader.readAsText(event.dataTransfer.files[0]);
            event.preventDefault();

        });
    }

    var x = document.getElementById("DragAndDrop");

    dropJSON(
        document.getElementById("DragAndDrop"),
        function (data) {
            // dropped - do something with data
            console.log(data);
        }
    );
});


