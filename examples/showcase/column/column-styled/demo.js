$(function () {

    var data = [7.6, 14.0, 7.5, 24.3, 11.1, 35.3, 8.4];

    new Contour({
            el: '.column-basic',
            xAxis: {
                categories: ['Milk (Whole)', 'Milk (Reduced Fat)', 'Tea', 'Coffee', 'Soft Drink (Diet)', 'Soft Drink (Reg)', 'Fruit juices'],
                labels: {
                    rotation: -45
                }
            },
            yAxis: {
                title: 'Gal. per Capita'
            }
        })
        .cartesian()
        .column(data)
        .tooltip()
        .render();
});
