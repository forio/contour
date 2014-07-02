$(function () {
    var redLine = [{x: 0, y: 170},{x: 88, y: 170},{x: 178, y: 149},{x: 201, y: 106},{x: 287, y: 83},{x: 331, y: 105},{x: 353, y: 172},{x: 400, y: 219}];
    var greenLine = [{x: 0, y: 220},{x: 87, y: 130},{x: 154, y: 197},{x: 197, y: 195},{x: 220, y: 214},{x: 286, y: 215},{x: 332, y: 263},{x: 378, y: 241}, {x: 400, y: 242}];
    var blueLine = [{x: 0, y: 103},{x: 44, y: 103},{x: 154, y: 36},{x: 309, y: 150},{x: 376, y: 150},{x: 400, y: 171}];
    var data = [ {name: 'redLine', data: redLine}, {name: 'greenLine', data: greenLine}, {name: 'blueLine', data: blueLine} ];

    new Contour({
        el: '.myChart',
        xAxis: { type: 'linear' },
        legend: { hAlign: 'left' }
      })
    .cartesian()
    .line(data)
    .legend(data)
    .render();
});