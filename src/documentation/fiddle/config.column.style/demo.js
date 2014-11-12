$(function () {
    var data = [2, 4, 6, 3, 5];
    var threshold = 5;

    new Contour({
        el: '.myColumnChart',
        column: { 
            style: function(d) {
                if (d.y > threshold) { return: 'fill: #000a0'; }
                else { return 'fill: #0000a0; opacity: 0.4'; }
            } 
        }
    })
    .cartesian()
    .column(data)
    .render();
});