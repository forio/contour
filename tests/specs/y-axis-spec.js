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
        jasmine.clock().install();
        instance = createinstance();
    });

    afterEach(function() {
        jasmine.clock().uninstall();
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
        var narwal = createinstance();
        narwal.nullVis([0,10,20,30]).render();
        d3.timer.flush();
        var ticks = $el.find('.y.axis .tick text');

        // 0, 6, 12, 18, 24, 30
        expect(ticks.length).toBe(6);
    });

    it('with smartAxis=true should only show 3 ticks (min, max + max rounded up)', function () {
        instance = createinstance({yAxis: { smartAxis: true }}).nullVis([0,31]).render();
        d3.timer.flush();
        var ticks = $el.find('.y.axis .tick text');

        expect(ticks.length).toBe(3);
    });

    it('with smartAxis=false should use the options.yAxis.ticks override if present', function () {
        var narwal = createinstance({ yAxis: {smartAxis: false, ticks: 4 }});
        narwal.nullVis([0,10,20,30]).render();
        d3.timer.flush();
        var ticks = $el.find('.y.axis .tick text');

        // 0, 6, 12, 18, 24, 30
        expect(ticks.length).toBe(5);
    });

    it('with smartAxis=false should delegate to d3 if options.yAxis.ticks override is not present', function () {
        var narwal = createinstance({ yAxis: {smartAxis: false, ticks: null }});
        narwal.nullVis([0,10,20,30]).render();
        d3.timer.flush();
        var ticks = $el.find('.y.axis .tick text');

        // 0, 6, 12, 18, 24, 30
        expect(ticks.length).toBe(6);
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
            createinstance({yAxis: { smartAxis: true}}).nullVis([1,2,3,4.5]).render();

            d3.timer.flush();
            var lastTicks = $el.find('.y.axis .tick text').last();

            // 4.5 round to nearest multiple of 2 in this case
            expect(lastTicks.text()).toBe('6');
        });

        describe('calling setYDomain', function () {
            it('should recalculate yAxis and ticks with new domain', function () {
                narwal = createinstance({yAxis: { smartAxis: true }}).nullVis([{data: [1,2,3,4]}, {data: [5,6,2,4]}]).render();

                // note that the max needs to be 5% away from 50
                narwal.setData([1,2,3,46]).render();
                var ticks = $el.find('.y.axis .tick text');
                expect(+ticks.last().text()).toBe(50);
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
            instance = createinstance({ yAxis: { min: 4 }});
        });

        it('should merge options.yAxis.min as the first tick', function () {
            instance.nullVis([10,20,30]).render();
            var topTick = $el.find('.y.axis .tick').first();
            expect(topTick.find('text').text()).toBe('4');
            expect(topTick.attr('transform')).toBe('translate(0,' + instance.options.chart.plotHeight + ')');
        });

        it('should show data min first tick as a tick', function () {
            // we should end with ticks at min, yMax and niceRoundMax
            instance.nullVis([10,20,30]).render();
            var ticks = $el.find('.y.axis .tick text');
            expect(ticks.eq(0).text()).toBe('4');
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
            instance = createinstance({yAxis: { min: -10, max: 20 }});
        });

        it('should set the domain to be [min, max]', function () {
            instance.nullVis([1,2,3]).render();

            expect(instance.yScale(20)).toBe(0);
            expect(instance.yScale(-10)).toBe(instance.options.chart.plotHeight);
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

