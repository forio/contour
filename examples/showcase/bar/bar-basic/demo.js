$(function () {

    var browserPenetration =[1.14, 8.51, 18.37, 28.54, 40.88];

    new Contour({
            el: '.bar-basic',
            xAxis: {
                categories: ['Opera', 'Safari', 'Firefox', 'IE', 'Chrome']
            },
            yAxis: {
                labels: {
                    formatter: function (d) {
                        return d + '%';
                    }
                }
            },
            tooltip: {
                formatter: function (d) {
                    return '<strong>' + d.x + '</strong><br>' + d.y + '%';
                }
            }
        })
        .cartesian()
        .horizontal()
        .bar(browserPenetration)
        .tooltip()
        .render();
});
