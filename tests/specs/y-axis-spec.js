describe('default yAxis', function () {
    var $el, el;
    var instance;

    if(!String.prototype.contains) {
        String.prototype.contains = function (str) {
            return this.indexOf(str) >= 0;
        };
    }

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
        jasmine.Clock.useMock();
        instance = createinstance();
    });

    function createinstance(options) {
        options = _.extend({ el: el, chart: { animations: false } }, options);
        instance = new Contour(options).cartesian();
        return instance;
    }

    it('should have outer Tick marks (ticks at the begining and end of the axis line)', function () {
        instance.nullVis([0,10,20,30]).render();
        // the actual axis path should start at -6 (the default outerTickSize)
        d3.timer.flush();
        expect($el.find('.y.axis .domain').attr('d')).toContain('M-6');
    });

    it('should default to smartAxis=false', function () {
        var nw = createinstance();
        nw.nullVis([0,10,20,30]).render();
        d3.timer.flush();
        var ticks = $el.find('.y.axis .tick text');

        // ticks are 0, 2, 4, 6, 8, 10
        expect(ticks.length).toBe(6);
    });

    it('with smartAxis=true should only show 3 ticks (min, max + max rounded up)', function () {
        instance = createinstance({yAxis: { smartAxis: true }}).nullVis([0,10,20,30]).render();
        d3.timer.flush();
        var ticks = $el.find('.y.axis .tick text');

        expect(ticks.length).toBe(3);
    });

    it('with smartAxis=false should use the options.yAxis.ticks override if present', function () {
        var nw = createinstance({ yAxis: {smartAxis: false, ticks: 4 }});
        nw.nullVis([0,10,20,30]).render();
        d3.timer.flush();
        var ticks = $el.find('.y.axis .tick text');

        expect(ticks.length).toBe(4);
    });

    it('with smartAxis=false should delegate to d3 if options.yAxis.ticks override is not present', function () {
        var nw = createinstance({ yAxis: {smartAxis: false, ticks: null }});
        nw.nullVis([0,10,20,30]).render();
        d3.timer.flush();
        var ticks = $el.find('.y.axis .tick text');

        // with the given values, d3 would do ticks every 5 so we would get 7 ticks: 0,5,10, 15, 20, 25, 30
        expect(ticks.length).toBe(7);
    });

    it('should align the middle of the label to the tick by default', function () {
        instance.nullVis([0,10,20,30]).render();
        d3.timer.flush();
        var ticks = $el.find('.y.axis .tick text');
        expect(_.all(ticks, function (t) { return $(t).attr('dy').contains('.35em'); })).toBe(true);
    });

    it('should align the middle of the label to the tick when set middle in options', function () {
        instance = createinstance({yAxis: { labels: { align: 'middle' }}});
        instance.nullVis([0,10,20,30]).render();
        d3.timer.flush();
        var ticks = $el.find('.y.axis .tick text');
        expect(_.all(ticks, function (t) { return $(t).attr('dy').contains('.35em'); })).toBe(true);
    });

    it('should be place the label above the tick when set top in options', function () {
        instance = createinstance({yAxis: { labels: { verticalAlign: 'bottom' }}});
        instance.nullVis([0,10,20,30]).render();
        d3.timer.flush();
        var ticks = $el.find('.y.axis .tick text');
        expect(_.all(ticks, function (t) { return $(t).attr('dy').contains('.8em'); })).toBe(true);
    });

    it('should be place the label below the tick when set top in options', function () {
        instance = createinstance({yAxis: { labels: { verticalAlign: 'top' }}});
        instance.nullVis([0,10,20,30]).render();
        d3.timer.flush();
        var ticks = $el.find('.y.axis .tick text');
        expect(_.all(ticks, function (t) { return $(t).attr('dy') === '0'; })).toBe(true);
    });

    describe('with smart y axis', function () {
        it('should round the max tick value to a nice value', function () {
            createinstance({yAxis: { smartAxis: true }}).nullVis([1,2,3,4]).render();

            d3.timer.flush();
            var lastTicks = $el.find('.y.axis .tick text').last();

            expect(lastTicks.text()).toBe('5');
        });

        describe('calling setYDomain', function () {
            it('should recalculate yAxis and ticks with new domain', function () {
                nw = createinstance({yAxis: { smartAxis: true }}).nullVis([{data: [1,2,3,4]}, {data: [5,6,2,4]}]).render();

                nw.setData([1,2,3,50]).render();
                var ticks = $el.find('.y.axis .tick text');
                expect(+ticks.last().text()).toBe(55);
            });
        });

        describe('with label formatter function set', function () {
            it('should use the function to format tick labels', function () {
                var text = 'format';
                instance = createinstance({yAxis:  { smartAxis: true, labels: {
                    formatter: function () { return text; }
                }}});

                instance.nullVis([1,2,3]).render();
                expect($el.find('.y.axis .tick text').eq(0).text()).toBe(text);
                expect($el.find('.y.axis .tick text').eq(1).text()).toBe(text);
                expect($el.find('.y.axis .tick text').eq(2).text()).toBe(text);
            });
        });
    });

    describe('without smartYAxis', function () {

    });


    describe('with options.yAxis.max set', function () {
        beforeEach(function () {
            instance = createinstance({ yAxis: { max: 100, min: null }});
        });

        it('should use the options.yAxis.max as the max of the domain', function () {
            instance.nullVis([0,10,20,30]).render();
            // a value equal to the max should be scaled at the top of the chart (y=0)
            expect(instance.yScale(100)).toBe(0);
        });

        it('should merge options.yAxis.min as the last tick', function () {
            instance.nullVis([0,10,20,30]).render();
            var topTick = $el.find('.y.axis .tick').last();
            expect(topTick.find('text').text()).toBe('100');
            expect(topTick.attr('transform')).toBe('translate(0,0)');
        });

        xit('should handle the case where max is less than the data set\'s min', function () {
            instance.nullVis([200, 300, 400]).render();
            var ticks = $el.find('.y.axis .tick');

            expect(ticks.length).toBe(1);
        });
    });


    describe('with options.yAxis.min set', function () {
        beforeEach(function () {
            // remove nicing so we have control of min and max for testing... still min has to be
            // a 'nice' number so we get a label
            instance = createinstance({ yAxis: { min: 4, nicing: false }});
        });

        it('should merge options.yAxis.min as the first tick', function () {
            instance.nullVis([10,20,30]).render();
            var topTick = $el.find('.y.axis .tick').first();
            expect(topTick.find('text').text()).toBe('4');
            expect(topTick.attr('transform')).toBe('translate(0,' + instance.options.chart.plotHeight + ')');
        });

        it('should not show data min as a tick', function () {
            // we should end with ticks at min, yMax and niceRoundMax
            instance.nullVis([10,20,30]).render();
            var ticks = $el.find('.y.axis .tick text');
            expect(ticks.eq(0).text()).toBe('4');
            expect(ticks.eq(1).text()).toBe('6');
            expect(ticks.eq(2).text()).toBe('8');
            /// ...
            expect(ticks.eq(ticks.length-1).text()).toBe('30');
        });

        it('should use it as the abs min of the domain', function () {
            instance.nullVis([10,20,30]).render();
            // a value equals to the min should be at the bottom of the chart
            // so it should be equal plotHeight (y grows down)
            expect(instance.yScale(4)).toBe(instance.options.chart.plotHeight);
        });

        it('should handle the case where min is greater than the data set\'s max', function () {
            instance = createinstance({yAxis: { min: 5 }}).nullVis([1,2,3,4]).render();
            var ticks = $el.find('.y.axis .tick');

            // we get no tick labels in this case.... the domains goes from 5 to 5
            expect(ticks.length).toBe(0);
        });
    });

    describe('with both min and max set', function () {
        beforeEach(function () {
            instance = createinstance({yAxis: { min: -2, max: 500, nicing: false }});
        });

        it('should set the domain to be [min, max]', function () {
            instance.nullVis([1,2,3]).render();

            expect(instance.yScale(500)).toBe(0);
            expect(instance.yScale(-2)).toBe(instance.options.chart.plotHeight);
        });
    });

    describe('with label formatter function set', function () {
        it('should use the function to format tick labels', function () {
            var text = 'format';
            // this function should get called once per label
            var formatter = function (/*label, index, fullCollection*/) { return text; };
            instance = createinstance({yAxis:  { smartAxis: false, labels: { formatter: formatter }}});

            instance.nullVis([1,2,3]).render();
            expect($el.find('.y.axis .tick text').eq(0).text()).toBe(text);
            expect($el.find('.y.axis .tick text').eq(1).text()).toBe(text);
            expect($el.find('.y.axis .tick text').eq(2).text()).toBe(text);
        });
    });

});

