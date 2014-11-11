$(function () {

        var data = [1, 2, 3, 4];
        var otherData = [5, 6, 7, 8];

        new Contour({
            el: '.myBarChart',
            bar: { barWidth: 20 }
          })
        .cartesian()
        .horizontal()
        .bar(data)
        .bar(otherData, { barWidth: 40, offset: 30 } )
        .render();

    // barWidth is divided evenly among *all* of the bar visualizations in this instance of Contour
    // so if you add multiple bar chart visualizations
    // mostly likely you will want to override this
    // *for each visualization* 
    // (and set the offset, so that bars for the two visualizations don't overlap)
        
});