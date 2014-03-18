$(function () {

    new Contour({
        el: '.myColumnChart',
        column: { offset: 15 }
      })
    .cartesian()
    .column([1, 2, 3, 4], { columnWidth: 10 })
    .column([5, 6, 7, 8], { columnWidth: 30, offset: 40 })
    .render();

    // offset is for *all* of the column visualizations in this instance of Contour. 
    // so if you add multiple column chart visualizations
    // mostly likely you will want to override this
    // *for each visualization*
});