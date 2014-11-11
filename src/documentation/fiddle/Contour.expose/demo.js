$(function () {

    
    Contour.expose('myCustomFunctions', {
        showData: function (data) {
            var yValues =  _.pluck(data[0].data, 'y').join(',');
            alert('The data are: ' + yValues);
        }
    });
    
    Contour.export('myVisualization', function (data, layer, options) {
        
        // for this call to work, the instance has to be augmented
        // with .myCustomFunctions(), then the object will have the
        // custom function showData()

        this.showData(data);
    });
    
    var data = [22, 8, 5, 19, 11, 4, 5, 13, 20, 29, 25];

    new Contour({
        el: '.myChart',
    })
    .cartesian()
    .line(data)
    
    // this adds the myCustomFunctions() to this instance of Contour
    .myCustomFunctions()
    
    // this adds the myVisualization to this instance of Contour
    .myVisualization(data)

    .render();
});
