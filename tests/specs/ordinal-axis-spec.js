describe('Ordinal xAxis', function () {
    var $el, el;
    var narwhal;

    function createNarwhal(options) {
        options = _.extend({ el: el }, options);
        narwhal = new Narwhal(options).cartesian();
        return narwhal;
    }

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
        narwhal = createNarwhal();
    });


    it('should not have any Tick marks', function () {
        narwhal.data([0,10,20,30]).render();
        var ticks = $el.find('.x.axis ');
        expect(_.all(ticks.find('.tick line'), function (t) { return $(t).attr('x2') === '0' && $(t).attr('y2') === '0'; })).toBe(true);
        expect(ticks.find('.domain').attr('d')).toContain('M0');
    });

    describe('with options.xAxis.min set', function () {
        beforeEach(function () {
            narwhal = createNarwhal({ xAxis: { min: 5 }});
        });

        xit('should use the options.xAxis.min as the min of the domain', function () {
            narwhal.data([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).render();
            // a value equal to the max should be scaled at the top of the chart (y=0)
            expect(narwhal.xScale(5)).toBe(0);
        });

        xit('should merge options.xAxis.min as the first tick', function () {
            // narwhal.data([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).render();

            // var ticks = $el.find('.x.axis .tick.major');
            // var topTick = ticks.first();
            // var correctOrder = true;

            // expect(topTick.find('text').text()).toBe('5');
            // expect(topTick.attr('transform')).toBe('translate(0,0)');
            // ticks.each(function (t, i) { correctOrder = correctOrder && $(t).find('text').text() === (i + 5) + ''; });
            // expect(correctOrder).toBe(true);
        });
    });

    describe('with options.xAxis.max set', function () {
        beforeEach(function () {
            narwhal = createNarwhal({ xAxis: { max: 7 }});
        });

        xit('should use the options.xAxis.max as the max of the domain', function () {
            narwhal.data([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).render();
            // a value equal to the max should be scaled at the top of the chart (y=0)
            expect(narwhal.xScale(7)).toBe(narwhal.options.chart.plotWidth);
        });
    });

    describe('with simple ordinal data (no categories)', function () {
        it('should only show first and last tick labels by default', function () {
           // var config = { xAxis: { firstAndLast: true } };
            narwhal = createNarwhal()
                .data([10, 20, 30])
                .render();

            var xLabels = narwhal.svg.selectAll('.x.axis .tick text')[0];
            expect(xLabels.length).toBe(2);
            expect($(xLabels[0]).text()).toBe('0');
            expect($(xLabels[1]).text()).toBe('2');
        });

        it('should show all category labels if firstAndLast is set to false', function () {
            var config = { xAxis: { firstAndLast: false } };
            narwhal = createNarwhal(config)
                .data([10, 20, 30])
                .render();

            var xLabels = narwhal.svg.selectAll('.x.axis .tick text')[0];
            expect(xLabels.length).toBe(3);
            expect($(xLabels[0]).text()).toBe('0');
            expect($(xLabels[1]).text()).toBe('1');
            expect($(xLabels[2]).text()).toBe('2');
        });

        it('should set text-anchor:middle for all labels', function () {
            narwhal = createNarwhal({ xAxis: { categories: ['one', 'two', 'three'], firstAndLast: false }})
                .data([10, 20, 30])
                .render();

            var xLabels = $(narwhal.svg.selectAll('.x.axis .tick text')[0]);
            expect(xLabels.eq(0).css('text-anchor')).toBe('middle');
            expect(xLabels.eq(2).css('text-anchor')).toBe('middle');
        });

    });

    describe('with axis categories defined', function () {

        it('should render category labels if xAxis.categories is defined', function () {
            narwhal = createNarwhal({ xAxis: { categories: ['one', 'two', 'three'], firstAndLast: false }})
                .data([10, 20, 30])
                .render();

            var xLabels = narwhal.svg.selectAll('.x.axis .tick text')[0];
            expect(xLabels.length).toBe(3);
            expect($(xLabels[0]).text()).toBe('one');
            expect($(xLabels[1]).text()).toBe('two');
            expect($(xLabels[2]).text()).toBe('three');
        });
    });

    describe('with data with x values for categories', function () {
        it('should render categories from x values', function () {
            narwhal = createNarwhal({xAxis: { firstAndLast: false }})
                .data([{x:'one', y: 10}, { x: 'two', y: 20}, { x: 'three', y: 30}])
                .render();

            var xLabels = narwhal.svg.selectAll('.x.axis .tick text')[0];
            expect(xLabels.length).toBe(3);
            expect($(xLabels[0]).text()).toBe('one');
            expect($(xLabels[1]).text()).toBe('two');
            expect($(xLabels[2]).text()).toBe('three');
        });
    });

    describe('xAxis title', function () {
        it('should be included if specificed in the options', function () {
            narwhal = createNarwhal({ xAxis: { title: 'xAxis' } });
            narwhal.data([1,2,3]).render();
            titles = $el.find('.axis-title');
            expect(titles.length).toBe(1);
            expect(titles.text()).toBe('xAxis');
        });

        it('should NOT be included if NOT specificed in the options', function () {
            narwhal = createNarwhal({ xAxis: { title: '' } });
            narwhal.data([1,2,3]).render();
            titles = $el.find('.x.axis-title');
            expect(titles.length).toBe(0);
        });

        it('should adjust bottom padding and plot height to fit the title', function () {
            createNarwhal({ xAxis: { title: 'hello world' }}).data([1,2,3]).render();
            var y = narwhal.options.chart.height - narwhal.options.chart.padding.bottom - narwhal.options.chart.padding.top;

            expect(narwhal.options.chart.padding.bottom).toBeGreaterThan(0);
            expect(narwhal.options.chart.plotHeight).toEqual(y);
        });

    });


});
