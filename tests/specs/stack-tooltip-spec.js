

describe('Stacked Tooltip', function () {

    var el, $el, nw;
    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createContour(options) {
        options = Object.assign({ el: el }, options);
        contour = new Contour(options).cartesian();
        return contour;
    }


    xit('should not render null values', function () {
        var tooltip = $('<div>');
        var data = [
                { name: 's1', data: [1,null,3] },
                { name: 's2', data: [4,5,3] },
                { name: 's3', data: [4,null,4] }
            ];
        nw = createContour().bar(data).stackedTooltip(data, {el: tooltip.get(0)});

        // NEED A GOOD WAY TO TEST MOUSE EVENTS FOR TOOLTIPS!!
    });
});
