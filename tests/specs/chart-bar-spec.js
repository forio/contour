describe('Bar chart', function () {

    var el, $el;
    var data = [1,2,3];
    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createNarwhal(options) {
        options = _.extend({ el: el, chart: { animations: false } }, options);
        var narwhal = new Narwhal(options).cartesian().horizontal();
        return narwhal;
    }

    describe('render', function () {
        it('should create one rect per data point', function () {
            createNarwhal().bar(data).render();
            var rects = $el.find('rect');
            expect(rects.length).toBe(3);
        });

        it('should add the Bar class to each Bar', function () {
            createNarwhal().bar(data).render();
            var rects = $el.find('rect');

            expect(rects.filter('.bar').length).toBe(3);
        });

        it('should add the tooltip-tracker class to each Bar', function () {
            createNarwhal().bar(data).render();
            var rects = $el.find('rect');

            expect(rects.filter('.tooltip-tracker').length).toBe(3);
        });

        it('should set the width of each Bar to the corresponding yScale value', function () {
            var nw = createNarwhal().bar(data).render();
            var rects = $el.find('rect');
            var x = function (d) { return nw.yScale(d); };

            expect(+rects.eq(0).attr('width')).toBe(x(data[0]));
            expect(+rects.eq(1).attr('width')).toBe(x(data[1]));
            expect(+rects.eq(2).attr('width')).toBe(x(data[2]));
        });

    });

});
