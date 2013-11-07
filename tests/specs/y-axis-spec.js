describe('default yAxis', function () {
    var $el, el;
    var narwhal;

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
        narwhal = createNarwhal();
    });

    function createNarwhal(options) {
        options = _.extend({ el: el }, options);
        narwhal = new Narwhal(options).cartesian();
        return narwhal;
    }

    it('should have outer Tick marks (ticks at the begining and end of the axis line)', function () {
        narwhal.data([0,10,20,30]).render();
        // the actual axis path should start at -6 (the default outerTickSize)
        expect($el.find('.y.axis .domain').attr('d')).toContain('M-6');
    });

    it('with smartAxis=true should only show 3 ticks (min, max + max rounded up)', function () {
        narwhal.data([0,10,20,30]).render();
        var ticks = $el.find('.y.axis .tick text');

        expect(ticks.length).toBe(3);
    });

    it('with smartAxis=false should use the options.yAxis.ticks override if present', function () {
        var nw = createNarwhal({ yAxis: {smartAxis: false, ticks: 4 }});
        nw.data([0,10,20,30]).render();
        var ticks = $el.find('.y.axis .tick text');

        expect(ticks.length).toBe(4);
    });

    it('with smartAxis=false should delegate to d3 if options.yAxis.ticks override is not present', function () {
        var nw = createNarwhal({ yAxis: {smartAxis: false, ticks: null }});
        nw.data([0,10,20,30]).render();
        var ticks = $el.find('.y.axis .tick text');

        // with the given values, d3 would do ticks every 5 so we would get 7 ticks: 0,5,10, 15, 20, 25, 30
        expect(ticks.length).toBe(7);
    });

    it('should align the middle of the label to the tick by default', function () {
        narwhal.data([0,10,20,30]).render();
        var ticks = $el.find('.y.axis .tick text');
        expect(_.all(ticks, function (t) { return $(t).attr('dy') === '.3em'; })).toBe(true);
    });

    it('should align the middle of the label to the tick when set middle in options', function () {
        narwhal = createNarwhal({yAxis: { labels: { align: 'middle' }}});
        narwhal.data([0,10,20,30]).render();
        var ticks = $el.find('.y.axis .tick text');
        expect(_.all(ticks, function (t) { return $(t).attr('dy') === '.3em'; })).toBe(true);
    });

    it('should align the top of the label to the tick when set top in options', function () {
        narwhal = createNarwhal({yAxis: { labels: { align: 'top' }}});
        narwhal.data([0,10,20,30]).render();
        var ticks = $el.find('.y.axis .tick text');
        expect(_.all(ticks, function (t) { return $(t).attr('dy') === '.9em'; })).toBe(true);
    });

    describe('with smart y axis (dafault)', function () {
        it('should round the max tick value to a nice value', function () {
            narwhal.data([1,2,3,4]).render();

            var lastTicks = $el.find('.y.axis .tick text').last();

            expect(lastTicks.text()).toBe('5');
        });

        it('should use the domain min and max when no min/max options are set ', function () {
            nw = createNarwhal({
                yAxis: {
                    min: null, // the default is 0, so wee need to remove it
                    //max: null, // by default we don't have max, is just here for clarity
                }
            }).data([10,20,30]).render(); // we should get and axis with ticks at 10, 15, 20, 25, 30

            var ticks = $el.find('.y.axis .tick text');
            expect(+ticks.eq(0).text()).toBe(10);
            expect(+ticks.eq(2).text()).toBe(33); // smart axis is 10% above (birddle test)
        });
    });

    describe('without smartYAxis', function () {
        it('should use the domain min and max when no min/max options are set ', function () {
            nw = createNarwhal({
                yAxis: {
                    min: null, // the default is 0, so wee need to remove it
                    smartAxis: false,
                }
            }).data([10,20,30]).render(); // d3 generates ticks every 2 so we get 10, 12, 14, 16 .... 30 (11 ticks total)

            var ticks = $el.find('.y.axis .tick text');
            expect(+ticks.eq(0).text()).toBe(10);
            expect(+ticks.eq(10).text()).toBe(30);
        });

        it('should use domain min when no options.min is defined', function () {
            nw = createNarwhal({
                yAxis: {
                    min: null, // the default is 0, so wee need to remove it
                    max: 50,
                    smartAxis: false
                }
            }).data([10,20,30]).render(); // we should get and axis with ticks every 5 at 10, 15, 20, 25 .. 50 (9 total)

            var ticks = $el.find('.y.axis .tick text');
            expect(+ticks.eq(0).text()).toBe(10);
            expect(+ticks.eq(8).text()).toBe(50);
        });
    });


    describe('with options.yAxis.max set', function () {
        beforeEach(function () {
            narwhal = createNarwhal({ yAxis: { max: 100, min: null }});
        });

        it('should use the options.yAxis.max as the max of the domain', function () {
            narwhal.data([0,10,20,30]).render();
            // a value equal to the max should be scaled at the top of the chart (y=0)
            expect(narwhal.yScale(100)).toBe(0);
        });

        it('should merge options.yAxis.min as the last tick', function () {
            narwhal.data([0,10,20,30]).render();
            var topTick = $el.find('.y.axis .tick').last();
            expect(topTick.find('text').text()).toBe('100');
            expect(topTick.attr('transform')).toBe('translate(0,0)');
        });

        xit('should handle the case where max is less than the data set\'s min', function () {
            narwhal.data([200, 300, 400]).render();
            var ticks = $el.find('.y.axis .tick');

            expect(ticks.length).toBe(1);
        });
    });


    describe('with options.yAxis.min set', function () {
        beforeEach(function () {
            narwhal = createNarwhal({ yAxis: { min: 3 }});
        });

        it('should merge options.yAxis.min as the first tick', function () {
            narwhal.data([10,20,30]).render();
            var topTick = $el.find('.y.axis .tick').first();
            expect(topTick.find('text').text()).toBe('3');
            expect(topTick.attr('transform')).toBe('translate(0,' + narwhal.options.chart.plotHeight + ')');
        });

        it('should not show data min as a tick', function () {
            // we should end with ticks at min, yMax and niceRoundMax
            narwhal.data([10,20,30]).render();
            var ticks = $el.find('.y.axis .tick text');
            expect(ticks.eq(0).text()).toBe('3');
            expect(ticks.eq(1).text()).toBe('30');
            expect(ticks.eq(2).text()).toBe('33'); // data yMax is 30 so nice round will give us 10% more
        });

        it('should use it as the abs min of the domain', function () {
            narwhal.data([10,20,30]).render();
            // a value equals to the min should be at the bottom of the chart
            // so it should be equal plotHeight (y grows down)
            expect(narwhal.yScale(3)).toBe(narwhal.options.chart.plotHeight);
        });

        it('should handle the case where min is greater than the data set\'s max', function () {
            narwhal.data([1,2,3]).render();
            var ticks = $el.find('.y.axis .tick');

            expect(ticks.length).toBe(1);
        });
    });

    describe('with both min and max set', function () {
        beforeEach(function () {
            narwhal = createNarwhal({yAxis: { min: -2, max: 500 }});
        });

        it('should set the domain to be [min, max]', function () {
            narwhal.data([1,2,3]).render();

            expect(narwhal.yScale(500)).toBe(0);
            expect(narwhal.yScale(-2)).toBe(narwhal.options.chart.plotHeight);
        });
    });

});

