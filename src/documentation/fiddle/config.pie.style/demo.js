$(function () {
    var data = [6, 2, 5, 3, 7];
    var threshold = 6;

    new Contour({
        el: '.myPieChart',
        pie: {  
            style: function(d) {
                if (d.value > threshold) { return 'opacity: 1'; }
                else { return 'opacity: 0.3';  }
            }
        }
    })
    .pie(data)
    .render();
});