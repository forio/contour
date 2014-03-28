$(function () {

    // sample data
    var data =[2,3,4,5,6,5,4,3,2];

    new Contour({
            el: '.bar-basic',
            yAxis: {
                max: 10
            }
        })
        .cartesian()
        .horizontal()
        .coolNarwhal()
        .bar(data)
        .render();
});
