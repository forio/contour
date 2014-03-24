$(function () {

    var data = [{
        name: "Gold medals",
        data: [{ x: "United States", y: 552 }, { x: "Russia", y: 234 }, { x: "China", y: 234 }, { x: "Germany", y: 223 }, { x: "Canada", y: 168 }, { x: "Australia", y: 163 }, { x: "Great Britain", y: 124 }, { x: "South Korea", y: 110 }, { x: "France", y: 108 }, { x: "Netherlands", y: 101 }]
    }, {
        name: "Silver medals",
        data: [{ x: "United States", y: 440 }, { x: "Russia", y: 221 }, { x: "China", y: 156 }, { x: "Germany", y: 183 }, { x: "Canada", y: 98 }, { x: "Australia", y: 226 }, { x: "Great Britain", y: 101 }, { x: "South Korea", y: 93 }, { x: "France", y: 107 }, { x: "Netherlands", y: 135 }]
    }, {
        name: "Bronze medals",
        data: [{ x: "United States", y: 320 }, { x: "Russia", y: 313 }, { x: "China", y: 140 }, { x: "Germany", y: 223 }, { x: "Canada", y: 104 }, { x: "Australia", y: 220 }, { x: "Great Britain", y: 97 }, { x: "South Korea", y: 105 }, { x: "France", y: 103 }, { x: "Netherlands", y: 82 }]
    }];

    new Contour({
            el: '.bar-stacked',

            chart: {
                padding: {
                    left: 110
                }
            },

            yAxis: {
                title: 'Total Medals'
            },

            bar: {
                stacked: true
            },

            legend: {
                vAlign: 'top'
            }
        })
        .cartesian()
        .horizontal()
        .bar(data)
        .legend(data)
        .tooltip()
        .render();
});
