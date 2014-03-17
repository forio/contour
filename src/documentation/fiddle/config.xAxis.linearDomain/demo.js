(function () {
	var data = [
        { x: new Date('1/1/2000'), y: 5},
        { x: new Date('2/1/2000'), y: 3},
        { x: new Date('3/1/2000'), y: 6},
        { x: new Date('4/1/2000'), y: 7},
        { x: new Date('4/2/2000'), y: 4},
        { x: new Date('4/30/2000'), y: 2}
    ];

	new Contour({
	    el: '.myLineChart',
    	xAxis: { type: 'time',  
            // set true to space the data points evenly;
            // set false to space the data points based
            //  on their relative values as dates
            linearDomain: false }
    	})
    .cartesian()
    .line(data)
    .tooltip()
	.render()
})();