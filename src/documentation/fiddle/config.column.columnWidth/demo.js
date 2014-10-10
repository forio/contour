$(function () {

        var data = [1, 2, 3, 4];
        var otherData = [5, 6, 7, 8];

        new Contour({
            el: '.myColumnChart',
            column: { columnWidth: 20 }
          })
        .cartesian()
        .column(data)
        .column(otherData, { columnWidth: 40, offset: 30 } )
        .render();

    // columnWidth is divided evenly among *all* of the column visualizations in this instance of Contour.
    // so if you add multiple column chart visualizations
    // mostly likely you will want to override this
    // *for each visualization* 
    // (and set the offset, so that columns for the two visualizations don't overlap)
        
});