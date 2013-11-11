describe('Horizontal frame', function () {
    var $el, el;
    var narwhal;

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createNarwhal(options) {
        options = _.extend({ el: el }, options);
        narwhal = new Narwhal(options);
        return narwhal;
    }

    describe('render', function () {
        beforeEach(function () {
            createNarwhal({ yAxis: { smartAxis: false }})
                .cartesian()
                .horizontal();
        });

        it('should use inverted scales', function () {
            narwhal.data([1,2,3]).render();
            var h = narwhal.options.chart.plotHeight;
            var w = narwhal.options.chart.plotWidth;


            expect(narwhal.yScale(0)).toBe(0);
            expect(narwhal.yScale(3)).toBe(w);

        });
    });

});
