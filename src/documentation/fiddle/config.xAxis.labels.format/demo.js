$(function () {
    var data = [{x:1, y:1}, {x:2.4, y:2}, {x:3.715, y:3}, {x:4.12, y:4}];

	// format follows the d3 formatting conventions
	// https://github.com/mbostock/d3/wiki/Formatting#wiki-d3_format

    new Contour({
        el: '.myLineChart',
        // have labels use currency, and
        // round to 1 significant digit
        xAxis: { 
        	type: 'linear',
        	labels: { format: '$r.1'} 
        }
      })
    .cartesian()
    .line(data)
    .tooltip()
    .render();
});