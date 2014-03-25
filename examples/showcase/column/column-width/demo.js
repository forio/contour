$(function () {

    var colDataWide = [
        { name: 'Batch 1', data: [6,5,3,5,6,4,3] }
    ];
    var colDataNarrow = [
        { name: 'Batch 2', data: [5,3,2,7,1,6,5] }
    ];

    new Contour({
            el: '.column-width',
            chart: {
                gridlines: 'horizontal'
            },
            xAxis: {
                title: 'Category',
                categories: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
            },
            yAxis: {
                title: 'Points'
            },
            column: { groupPadding: 20 }
        })
        .cartesian()
        .column(colDataWide, {
            columnWidth: function () { return this.rangeBand / 3 * 2; }
        } )
        // create grouping by adding a second column visualization to this Contour instance
        // add an offset so that this visualization doesn't overlap with the first one
        .column(colDataNarrow, {
            columnWidth: function() { return this.rangeBand / 2; },
            offset: function() { return this.rangeBand / 2 + 1; }
        })
        .render();
});
