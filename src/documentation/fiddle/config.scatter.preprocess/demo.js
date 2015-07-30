$(function () {

	// sample preprocssing function, 
	// returns only the first n elements of the data

	function myProcessor(n) {
		return function(data) {
			var newData = [];
        	for (var i=0; i<n; i++) {
        		// sample function assumes only one series in origData
        		newData[i] = data[0].data[i];
        	}
        	return [{ name: data[0].name, data: newData }];
		}
    }

    var origData = [{x: 0, y: 103},{x: 44, y: 103},{x: 154, y: 36},{x: 309, y: 150},{x: 376, y: 150},{x: 400, y: 171}];

    new Contour({
        el: '.myScatterPlot',
        scatter: { preprocess: myProcessor(3) }
      })
    .cartesian()
    .scatter(origData)
    .render();
});