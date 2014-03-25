$(function () {

    var temps = [52, 53, 69, 74, 78, 89, 94, 87, 82, 73, 64];

    new Contour({
            el: '.line-basic',
            chart: {
                gridlines: 'both'
            },
            xAxis: {
                categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov']
            },
            yAxis: {
                title: 'Degrees (F)',
                titlePadding: 15
            },
            tooltip: {
                formatter: function (d) {
                    return '<span class="tooltip-value">' + d.y + '&deg;</span>';
                }
            },
            line: {
                marker: {
                    size: 5
                }
            }
        })
        .cartesian()
        .line(temps)
        .tooltip()
        .render();
});
