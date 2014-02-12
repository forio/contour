describe('time Axis', function () {

    var $el, el;
    var narwhal;

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createNarwhal(options) {
        options = _.extend({ el: el }, options);
        narwhal = new Narwhal(options).cartesian();
        return narwhal;
    }

    it('should only show first and last tick labels by default', function () {
        narwhal = createNarwhal()
            .nullVis([
                { x: new Date('10/11/2013'), y: 10 },
                { x: new Date('10/12/2013'), y: 20 },
                { x: new Date('10/13/2013'), y: 30 }
            ])
            .render();

        var xLabels = narwhal.svg.selectAll('.x.axis .tick text')[0];
        expect(xLabels.length).toBe(2);
    });

    it('should set text-anchor:left to first label and text-anchor:end to last label only when firstAndLast is set to true', function () {
        narwhal = createNarwhal({ xAxis: { firstAndLast: true }})
            .nullVis([
                { x: new Date('10/11/2013'), y: 10 },
                { x: new Date('10/12/2013'), y: 20 },
                { x: new Date('10/13/2013'), y: 30 }
            ])
            .render();

        var xLabels = $(narwhal.svg.selectAll('.x.axis .tick text')[0]);
        expect(xLabels.eq(0).css('text-anchor')).toBe('start');
        expect(xLabels.eq(1).css('text-anchor')).toBe('end');
    });

    it('should set text-anchor:middle on first and last labels only when firstAndLast is set to false', function () {
        narwhal = createNarwhal({ xAxis: { firstAndLast: false }})
            .nullVis([
                { x: new Date('10/11/2013'), y: 10 },
                { x: new Date('10/12/2013'), y: 20 },
                { x: new Date('10/13/2013'), y: 30 }
            ])
            .render();

        var xLabels = $(narwhal.svg.selectAll('.x.axis .tick text')[0]);
        expect(xLabels.eq(0).css('text-anchor')).toBe('middle');
        expect(xLabels.eq(2).css('text-anchor')).toBe('middle');
    });

    it('should top the number of ticks to options.xAxis.maxTicks if pressent', function () {
        narwhal = createNarwhal({ xAxis: { firstAndLast: false, maxTicks: 2 }})
            .nullVis([
                { x: new Date('10/11/2013'), y: 10 },
                { x: new Date('10/12/2013'), y: 20 },
                { x: new Date('10/13/2013'), y: 30 }
            ])
            .render();

        var xLabels = $(narwhal.svg.selectAll('.x.axis .tick text')[0]);
        expect(xLabels.length).toBe(2);
    });

    it('should print hrs, when xDomain is all in the same day', function () {
        narwhal = createNarwhal({ xAxis: { firstAndLast: false }})
            .nullVis([
                { x: new Date('10/11/2013 10:00'), y: 10 },
                { x: new Date('10/11/2013 11:00'), y: 20 },
                { x: new Date('10/11/2013 12:00'), y: 30 }
            ])
            .render();

        var xLabels = $(narwhal.svg.selectAll('.x.axis .tick text')[0]);
        expect(xLabels.eq(0).text()).toBe('10:00');
        expect(xLabels.eq(1).text()).toBe('11:00');
        expect(xLabels.eq(2).text()).toBe('12:00');
    });

    it('should used formatter function if defined', function () {
        var text = 'some text for the axis';
        var formatter = function () { return text; };
        narwhal = createNarwhal({ xAxis: { firstAndLast: false, labels: { formatter: formatter } }})
            .nullVis([
                { x: new Date('10/11/2013 10:00'), y: 10 },
                { x: new Date('10/11/2013 11:00'), y: 20 },
                { x: new Date('10/11/2013 12:00'), y: 30 }
            ])
            .render();

        var xLabels = $(narwhal.svg.selectAll('.x.axis .tick text')[0]);
        expect(xLabels.eq(0).text()).toBe(text);
        expect(xLabels.eq(1).text()).toBe(text);
        expect(xLabels.eq(2).text()).toBe(text);

    });

    describe('with the linearDomain options set to true', function () {
        it('should partition the x axis in equal steps regardless of the actual date/time', function () {
            var data = [
                    { x: new Date('10/11/2013 10:00'), y: 10 },
                    { x: new Date('10/11/2013 11:00'), y: 20 },
                    { x: new Date('12/11/2013 10:00'), y: 30 }
                ];
            var narwhal = createNarwhal({ chart: { width: 400 }, xAxis: { linearDomain: true, firstAndLast: false }})
                .nullVis(data)
                .render();

            var xLabels = $(narwhal.svg.selectAll('.x.axis .tick text')[0]);
            var w = narwhal.options.chart.plotWidth;

            expect(narwhal.xScale(data[0].x)).toBe(0);
            expect(narwhal.xScale(data[1].x)).toBe(w/2);
            expect(narwhal.xScale(data[2].x)).toBe(w);

        });
    });

});
