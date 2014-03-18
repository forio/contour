$(function () {
    var data = [1.02, 2.3, 4.75, 5.0, 6.13, 7.4, 8.9];

    // format follows the d3 formatting conventions
    // https://github.com/mbostock/d3/wiki/Formatting#wiki-d3_format
    
    new Contour({
        el: '.myLineChart',
        // have labels use currency, and
        // round to 1 significant digit
        yAxis: { labels: { format: '$r.1'} }
      })
    .cartesian()
    .line(data)
    .tooltip()
    .render();
});