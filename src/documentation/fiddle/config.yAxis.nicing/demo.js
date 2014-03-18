$(function () {
    new Contour({
        el: '.myLineChart',
        yAxis: { nicing: false }
      })
    .cartesian()
	//for this data set, 
	//nicing: false draws the top tick mark at 8.2 
	//nicing: true draws the top tick mark at 9    
    .line([0.8, 2, 4, 5, 8.2])
    .render();
});