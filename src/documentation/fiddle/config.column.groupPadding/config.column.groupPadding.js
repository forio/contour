(function () {

        new Contour({
            el: '.myColumnChart',
            column: { groupPadding: 15 }
          })
        .cartesian()
        .column([
            {name: 'series1', data: [1,2,3,4]},
            {name: 'series2', data: [5,6,7,8]}
          ])
        .render()
        
})();