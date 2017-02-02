$(function () {

    // sample data set
    var data = [22, 8, 5, 19, 11, 4, 5, 13, 20, 29, 25];

    // we create a Contour instance
    new Contour({
        el: '.chart',
        yAxis: {
            tickValues: function (data) {
                return data.map(function(d) {  return d.y; });
            }
        }
    })
    // adding a cartesian frame to the instance gives use an X and Y axis
    // and provide scaling service for the visualizations
    .cartesian()
    // we now add a line visualization to the instance
    // and we pass in the data we want to use
    .line(data)
    // finally we call render to draw the chart and visualizations onto the web page (DOM)
    .render();
});
