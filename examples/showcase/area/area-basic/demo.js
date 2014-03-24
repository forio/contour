$(function () {
    var housePrice = [
        { x: 2000, y: 418530 },
        { x: 2001, y: 432050 },
        { x: 2002, y: 410865 },
        { x: 2003, y: 465025 },
        { x: 2004, y: 548088 },
        { x: 2005, y: 565843 },
        { x: 2006, y: 598243 },
        { x: 2007, y: 535018 },
        { x: 2008, y: 498356 },
        { x: 2009, y: 542686 },
        { x: 2010, y: 652301 },
        { x: 2011, y: 695342 },
        { x: 2012, y: 752354 },
        { x: 2013, y: 780543 }
    ];

    var moneyFormatter = d3.format('$,.0f');
    new Contour({
            el: '.area-basic',

            xAxis: {
                title: 'Year'
            },

            yAxis: {
                title: 'Value (US $)'
            },

            tooltip: {
                formatter: function (d) {
                    return 'Average house price<br>Year: ' + d.x + '<br>' + moneyFormatter(d.y);
                }
            }
        })
        .cartesian()
        .area(housePrice)
        .line(housePrice, { marker: { size: 3 } } )
        .tooltip()
        .render();
});
