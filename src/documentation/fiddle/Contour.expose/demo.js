$(function () {

    var data = [22, 8, 5, 19, 11, 4, 5, 13, 20, 29, 25];


    Contour.expose('myCustomFunction', function ctor(params) {
        // params are the parameters passed into the constructor function
        return {
            // the init function, if provided, is called automatically upon instantiation of the functionality
            // the options parameter has the global Contour options object
            init: function (options) { },

            // when included in a Contour instance,
            // the function `.showData` is available in the visualizations
            showScaledData: function (data) {
                var yValues =  data[0].data.map(function (d) { return d.y; }).map(function(input) { return input * params.factor; }).join(',');
                alert('The scaled data are: ' + yValues);
            }
        };
    });

    Contour.export('myVisualization', function (data, layer) {
        // for this call to work, .myCustomFunction() must first be added
        // to the Contour instance
        this.showScaledData(data);
    });

    new Contour({ el: '.myChart' })
        // add myCustomFunction() to this instance of Contour,
        // so other visualizations can use it
    .myCustomFunction({ factor: 4 })
    .cartesian()
    .line(data)
        // add myVisualization to this instance of Contour
    .myVisualization(data)
    .render();
});