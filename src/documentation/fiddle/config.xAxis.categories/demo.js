$(function () {
    new Contour({
        el: '.myLineChart',
        xAxis: { categories: ['apples', 'oranges', 'bananas', null, 'grapes', 'pears'] }
      })
    .cartesian()  
    .line([1, 2, 4, 5, 6, 8])
    .tooltip()
    .render()
});