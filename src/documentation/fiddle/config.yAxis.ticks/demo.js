$(function () {
    new Contour({
        el: '.myLineChart',
        yAxis: { ticks: 4 }
      })
    .cartesian()
    	//for this data set, 
		//ticks: 4 draws tick marks at 0, 2, 4, 6, 8
		//ticks: 15 draws tick marks at 0.5, 1, 1.5, 2, 2.5, etc.
    .line([1, 2, 4, 5, 6, 7, 8])
    .render();
});