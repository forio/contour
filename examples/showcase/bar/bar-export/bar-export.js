(function () {
    Narwhal.export('customTooltipSingleSeries', function (data, layer) {
    	// data[0] is the first data series.
    	// because our data, below, only includes one data series, 
    	// we can get the data series values 
    	// by looping through the elements of data[0].data
        for (var i=0; i < data[0].data.length; i++) {
        	// use d3 to draw the text for the tooltip
            layer.append('text')
               .attr('class', 'axis')
               .attr('y', this.xScale(data[0].data[i].x)+this.rangeBand/2)
               .attr('x', this.yScale(data[0].data[i].y)+10)
               .text(data[0].data[i].y)
        }

    });

    var data = [1, 2, 3, 4, 5, 4, 3, 2, 1];

    new Narwhal({
        el: '.bar-export',
      })
    .cartesian()
    .horizontal()
    .bar(data)
    .customTooltipSingleSeries(data)
    .render();
})();