describe('Column chart', function () {

    var el, $el;
    var data = [1,2,3];
    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createNarwhal(options) {
        options = _.extend({ el: el, chart: { animations: false } }, options);
        var narwhal = new Narwhal(options).cartesian();
        return narwhal;
    }

    describe('render', function () {
        it('should create one rect per data point', function () {
            createNarwhal().column(data).render();
            var rects = $el.find('rect');
            expect(rects.length).toBe(3);
        });

        it('should add the column class to each column', function () {
            createNarwhal().column(data).render();
            var rects = $el.find('rect');

            expect(rects.filter('.column').length).toBe(3);
        });

        it('should set the hight of each column to the corresponding yScale value', function () {
            var nw = createNarwhal().column(data).render();
            var rects = $el.find('rect');
            var y = function (d) { return nw.options.chart.plotHeight - nw.yScale(d); };

            expect(+rects.eq(0).attr('height')).toBe(y(data[0]));
            expect(+rects.eq(1).attr('height')).toBe(y(data[1]));
            expect(+rects.eq(2).attr('height')).toBe(y(data[2]));
        });

    });

});
