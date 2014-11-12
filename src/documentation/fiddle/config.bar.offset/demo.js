$(function () {

    new Contour({
        el: '.myBarChart',
        bar: { offset: 15 }
      })
    .cartesian()
    .horizontal()
    .bar([1, 2, 3, 4], { barWidth: 10 })
    .bar([5, 6, 7, 8], { barWidth: 30, offset: 40 })
    .render();

    // offset is for *all* of the column visualizations in this instance of Contour. 
    // so if you add multiple column chart visualizations
    // mostly likely you will want to override this
    // *for each visualization*
});