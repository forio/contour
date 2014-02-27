(function () {

    var colDataWide = [
        { name: 'First Series', data: [6,5,3,5,6,4,3] }
    ];
    var colDataNarrow = [
        { name: 'Second Series', data: [5,3,2,7,1,6,5] }
    ];

    new Narwhal({
            el: '.myChart',
            xAxis: {
                title: 'Index or Category',
            },
            yAxis: {
                title: 'Value'
            },
            column: { groupPadding: 15 }
        })
        .cartesian()
        .column(colDataWide, { 
            columnWidth: function () { return this.rangeBand / 3 * 2; }
        } )
        // create grouping by adding a second column visualization to this Narwhal instance
        // add an offset so that this visualization doesn't overlap with the first one
        .column(colDataNarrow, { 
            columnWidth: function() { return this.rangeBand / 3; },
            offset: function() { return this.rangeBand / 3 * 2 + 1 }
        } )
        .render();
})();