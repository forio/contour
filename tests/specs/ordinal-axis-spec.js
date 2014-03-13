describe('Ordinal xAxis', function () {
    var $el, el;
    var instance;

    function createinstance(options) {
        options = _.extend({ el: el }, options);
        instance = new Contour(options).cartesian();
        return instance;
    }

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
        instance = createinstance();
    });


    it('should have any Tick marks of 6px by default', function () {
        instance.nullVis([0,10,20,30]).render();
        d3.timer.flush();
        var ticks = $el.find('.x.axis ');
        expect(_.all(ticks.find('.tick line'), function (t) { return $(t).attr('x2') === '0' && $(t).attr('y2') === '6'; })).toBe(true);
        expect(ticks.find('.domain').attr('d')).toContain('M0');
    });


    it('should change padding between axis and first rangeBand using outerRangePadding', function () {
        /// TODO:
        /// This test is very brittle, and the actual scale is dependent on with chart width
        /// so it has to have the width: 402... we need to fix this
        function getScale (inner, outer) {
            instance = createinstance({
                    chart: { width: 402 },
                    xAxis: { innerRangePadding: inner, outerRangePadding: outer }
                })
                .nullVis([10, 20, 30]).render();
            return instance.xAxis().scale();
        }

        var scale = getScale(0, 0);

        expect(scale(0)).toBe(1);

        scale = getScale(0, 0.5);
        var width = scale.rangeBand();
        expect(scale(0)).toBe(width / 2 + 1);
    });

    it('should change padding between columns using innerRangePadding', function () {
        /// TODO: find a better way to test this without hardcoding the expected result... the problem
        /// is that this is dependent on the plotWidth, that varies depending on the axis labels, etc.

        var data = [10, 20, 30];
        function getScale (inner, outer) {
            instance = createinstance({
                    chart: { width: 400 },
                    xAxis: { innerRangePadding: inner, outerRangePadding: outer }
                })
                .nullVis(data).render();
            return instance.xAxis().scale();
        }

        var scale = getScale(0, 0);
        // with 0 inner range padding, we should get the second range (scale(1)) at exaclty the width of the columns
        var width = scale.rangeBand();
        expect(scale(1)).toBe(120);

        scale = getScale(0, 0.5);
        width = scale.rangeBand();
        // with 50% inner padding, we should get the second range (scale(1)) at 1 1/2 the width of the columns
        expect(scale(1)).toBe(135);
    });

    describe('with options.xAxis.min set', function () {
        beforeEach(function () {
            instance = createinstance({ xAxis: { min: 5 }});
        });

        xit('should use the options.xAxis.min as the min of the domain', function () {
            instance.nullVis([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).render();
            // a value equal to the max should be scaled at the top of the chart (y=0)
            expect(instance.xScale(5)).toBe(0);
        });

        xit('should merge options.xAxis.min as the first tick', function () {
            // instance.nullVis([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).render();

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
            instance = createinstance({ xAxis: { max: 7 }});
        });

        xit('should use the options.xAxis.max as the max of the domain', function () {
            instance.nullVis([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).render();
            // a value equal to the max should be scaled at the top of the chart (y=0)
            expect(instance.xScale(7)).toBe(instance.options.chart.plotWidth);
        });
    });

    describe('with simple ordinal data (no categories)', function () {
        it('should only show all tick labels by default (firstAndLast should default to false)', function () {
            var config = { xAxis: { firstAndLast: undefined } };
            instance = createinstance(config)
                .nullVis([10, 20, 30])
                .render();

            var xLabels = instance.svg.selectAll('.x.axis .tick text')[0];
            expect(xLabels.length).toBe(3);
            expect($(xLabels[0]).text()).toBe('0');
            expect($(xLabels[1]).text()).toBe('1');
            expect($(xLabels[2]).text()).toBe('2');
        });

        it('should only show first and last tick labels if firstAndLast is set to true', function () {
            var config = { xAxis: { firstAndLast: true } };
            instance = createinstance(config)
                .nullVis([10, 20, 30])
                .render();

            var xLabels = instance.svg.selectAll('.x.axis .tick text')[0];
            expect(xLabels.length).toBe(2);
            expect($(xLabels[0]).text()).toBe('0');
            expect($(xLabels[1]).text()).toBe('2');
        });

        it('should show all category labels if firstAndLast is set to false', function () {
            var config = { xAxis: { firstAndLast: false } };
            instance = createinstance(config)
                .nullVis([10, 20, 30])
                .render();

            var xLabels = instance.svg.selectAll('.x.axis .tick text')[0];
            expect(xLabels.length).toBe(3);
            expect($(xLabels[0]).text()).toBe('0');
            expect($(xLabels[1]).text()).toBe('1');
            expect($(xLabels[2]).text()).toBe('2');
        });

        it('should set text-anchor:middle for all labels', function () {
            instance = createinstance({ xAxis: { categories: ['one', 'two', 'three'], firstAndLast: false }})
                .nullVis([10, 20, 30])
                .render();

            var xLabels = $(instance.svg.selectAll('.x.axis .tick text')[0]);
            expect(xLabels.eq(0).css('text-anchor')).toBe('middle');
            expect(xLabels.eq(2).css('text-anchor')).toBe('middle');
        });

    });

    describe('with axis categories defined', function () {

        it('should render category labels if xAxis.categories is defined', function () {
            instance = createinstance({ xAxis: { categories: ['one', 'two', 'three'], firstAndLast: false }})
                .nullVis([10, 20, 30])
                .render();

            var xLabels = instance.svg.selectAll('.x.axis .tick text')[0];
            expect(xLabels.length).toBe(3);
            expect($(xLabels[0]).text()).toBe('one');
            expect($(xLabels[1]).text()).toBe('two');
            expect($(xLabels[2]).text()).toBe('three');
        });
    });

    describe('with data with x values for categories', function () {
        it('should render categories from x values', function () {
            instance = createinstance({xAxis: { firstAndLast: false }})
                .nullVis([{x:'one', y: 10}, { x: 'two', y: 20}, { x: 'three', y: 30}])
                .render();

            var xLabels = instance.svg.selectAll('.x.axis .tick text')[0];
            expect(xLabels.length).toBe(3);
            expect($(xLabels[0]).text()).toBe('one');
            expect($(xLabels[1]).text()).toBe('two');
            expect($(xLabels[2]).text()).toBe('three');
        });
    });

    describe('xAxis title', function () {
        it('should be included if specificed in the options', function () {
            instance = createinstance({ xAxis: { title: 'xAxis' } });
            instance.nullVis([1,2,3]).render();
            titles = $el.find('.axis-title');
            expect(titles.length).toBe(1);
            expect(titles.text()).toBe('xAxis');
        });

        it('should NOT be included if NOT specificed in the options', function () {
            instance = createinstance({ xAxis: { title: '' } });
            instance.nullVis([1,2,3]).render();
            titles = $el.find('.x.axis-title');
            expect(titles.length).toBe(0);
        });

        it('should adjust bottom padding and plot height to fit the title', function () {
            createinstance({ xAxis: { title: 'hello world' }}).nullVis([1,2,3]).render();
            var y = instance.options.chart.height - instance.options.chart.internalPadding.bottom - instance.options.chart.padding.top;

            expect(instance.options.chart.internalPadding.bottom).toBeGreaterThan(0);
            expect(instance.options.chart.plotHeight).toEqual(y);
        });

    });

    it('should use the label formatting function to format tick labels if defined', function () {
        var text = 'format';
        // this function should get called once per label
        var formatter = function (label, index, fullCollection) { return text; };
        instance = createinstance({xAxis:  { firstAndLast: false, labels: { formatter: formatter }}});

        instance.nullVis([1,2,3]).render();
        expect($el.find('.x.axis .tick text').eq(0).text()).toBe(text);
        expect($el.find('.x.axis .tick text').eq(1).text()).toBe(text);
        expect($el.find('.x.axis .tick text').eq(2).text()).toBe(text);
    });


});
