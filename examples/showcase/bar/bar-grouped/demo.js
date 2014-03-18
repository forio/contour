$(function () {
    var data = [
        {
            name: 'First Series',
            data: [1,2,3,4,2]
        },
        {
            name: 'Second Series',
            data: [1,1,1,1,8]
        },
        {
            name: 'More Stuff',
            data: [4,4,4,2,3]
        }
    ];

    new Contour({
            el: '.bar-grouped',
            xAxis: {
                title: 'Category',
            },
            yAxis: {
                title: 'Value'
            }
        })
        .cartesian()
        .horizontal()
        .bar(data)
        .stackTooltip(data, { el: '.bar-stack-tooltip' })
        .render();
});