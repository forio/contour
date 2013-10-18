describe('Cartesian frame', function () {
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

    it('should expose "cartesian" constructor function', function () {
        expect(Narwhal.prototype.cartesian).toBeDefined();
    });

    describe('constructor', function () {
    });

    describe('default xScale', function () {
        beforeEach(function () {
            narwhal = createNarwhal();
        });

        it('should throw if no data is set', function () {
            expect(narwhal.render).toThrow();
        });

        it('should be an ordinal scaling', function () {
            narwhal.data([0,10,20,30]).render();

            // TODO: NEED TO FIX THIS TEST

            // expect(narwhal.xScale(0)).toEqual(0);
            // expect(narwhal.xScale(1)).toEqual(100);
            // expect(narwhal.xScale(2)).toEqual(200);
            // expect(narwhal.xScale(3)).toEqual(300);
        });
    });

    describe('default yScale', function () {
        beforeEach(function () {
            narwhal = createNarwhal();
        });

        it('should be an inverted linear scaling', function () {
            narwhal.data([0,10,20,30,40]).render();
            var h = narwhal.options.chart.plotHeight;

            expect(narwhal.yScale(0)).toEqual(h);
            expect(narwhal.yScale(20)).toEqual(h/2);
            expect(narwhal.yScale(40)).toEqual(0);
        });

    });

    describe('default xAxis', function () {
        beforeEach(function () {
            narwhal = createNarwhal();
        });

        describe('with options.xAxis.min set', function () {
            beforeEach(function () {
                narwhal = createNarwhal({ xAxis: { min: 5 }});
            });

            it('should use the options.xAxis.min as the min of the domain', function () {
                narwhal.data([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).render();
                // a value equal to the max should be scaled at the top of the chart (y=0)
                expect(narwhal.xScale(5)).toBe(0);
            });

            it('should merge options.xAxis.min as the first tick', function () {
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

            it('should use the options.xAxis.max as the max of the domain', function () {
                narwhal.data([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).render();
                // a value equal to the max should be scaled at the top of the chart (y=0)
                expect(narwhal.xScale(7)).toBe(narwhal.options.chart.plotWidth);
            });
        });

    });

    describe('default yAxis', function () {
        beforeEach(function () {
            narwhal = createNarwhal();
        });

        it('should not have innerTick', function () {
            narwhal.data([0,10,20,30]).render();
            var ticks = $el.find('.y.axis .tick.major');
            expect(_.all(ticks.find('line'), function (t) { return $(t).attr('x2') === '0' && $(t).attr('y2') === '0'; })).toBe(true);
        });

        it('should have outerTick', function () {
            narwhal.data([0,10,20,30]).render();
            // the actual axis path should start at -6 (the default outerTickSize)
            expect($el.find('.y.axis .domain').attr('d')).toContain('M-6');
        });

        it('should align the top of the label to the tick', function () {
            narwhal.data([0,10,20,30]).render();
            var ticks = $el.find('.y.axis .tick.major text');
            expect(_.all(ticks, function (t) { return $(t).attr('dy') === '.9em'; })).toBe(true);
        });

        describe('with options.yAxis.max set', function () {
            beforeEach(function () {
                narwhal = createNarwhal({ yAxis: { max: 100 }});
            });

            it('should use the options.yAxis.max as the max of the domain', function () {
                narwhal.data([0,10,20,30]).render();
                // a value equal to the max should be scaled at the top of the chart (y=0)
                expect(narwhal.yScale(100)).toBe(0);
            });

            it('should merge options.yAxis.min as the last tick', function () {
                narwhal.data([0,10,20,30]).render();
                var topTick = $el.find('.y.axis .tick.major').last();
                expect(topTick.find('text').text()).toBe('100');
                expect(topTick.attr('transform')).toBe('translate(0,0)');
            });

            it('should handle the case where max is less than the data set\'s min', function () {
                narwhal.data([200, 300, 400]).render();
                var ticks = $el.find('.y.axis .tick.major');

                expect(ticks.length).toBe(1);
            });
        });

        describe('with options.yAxis.min set', function () {
            beforeEach(function () {
                narwhal = createNarwhal({ yAxis: { min: 3 }});
            });

            it('should merge options.yAxis.min as the first tick', function () {
                narwhal.data([10,20,30]).render();
                var topTick = $el.find('.y.axis .tick.major').first();
                expect(topTick.find('text').text()).toBe('3');
                expect(topTick.attr('transform')).toBe('translate(0,' + narwhal.options.chart.plotHeight + ')');
            });

            it('should use it as the abs min of the domain', function () {
                narwhal.data([10,20,30]).render();
                // a value equals to the min should be at the bottom of the chart
                // so it should be equal plotHeight (y grows down)
                expect(narwhal.yScale(3)).toBe(narwhal.options.chart.plotHeight);
            });

            it('should handle the case where min is greater than the data set\'s max', function () {
                narwhal.data([1,2,3]).render();
                var ticks = $el.find('.y.axis .tick.major');

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

    describe('render', function () {
        // this should be in the render, because is data dependent
        it('should provide scaling function (xScale & yScale) for visualizations to use', function () {
            var target = createNarwhal()
                .data([1,2,3])
                .render();

            expect(target.xScale).toBeDefined();
            expect(target.yScale).toBeDefined();
        });

        it('should call visualizations to render!', function () {
            var mock = { render: function () { }};
            var target = createNarwhal();
            spyOn(mock, 'render');

            target.visualizations.push(mock.render);
            target.data([1,2]).render();

            expect(mock.render).toHaveBeenCalled();
        });

        it('should render an xAxis at the bottom of the chart', function () {
            createNarwhal().data([1,2,3]).render();
            var axis = $el.find('.x.axis');
            var y = narwhal.options.chart.plotHeight + narwhal.options.chart.padding.top;
            var x = narwhal.options.chart.padding.left;

            expect(axis.length).toEqual(1);
            expect(axis.attr('transform')).toEqual('translate(' + x + ',' + y + ')');
        });

        it('should adjust bottom padding and plot height to fit the xAxis and labels', function () {
            createNarwhal().data([1,2,3]).render();
            var y = narwhal.options.chart.height - narwhal.options.chart.padding.bottom - narwhal.options.chart.padding.top;

            expect(narwhal.options.chart.padding.bottom).toBeGreaterThan(0);
            expect(narwhal.options.chart.plotHeight).toEqual(y);
        });

        it('should render an yAxis at the left of the chart', function () {
            createNarwhal().data([1,2,3]).render();
            var axis = $el.find('.y.axis');
            var x = narwhal.options.chart.padding.left;
            var y = narwhal.options.chart.padding.top;

            expect(axis.length).toEqual(1);
            expect(axis.attr('transform')).toEqual('translate(' + x + ',' + y + ')');
        });

        it('should position the yAxis at the left with some padding', function () {
            createNarwhal().data([1,2,3]).render();
            var x = narwhal.options.chart.width - narwhal.options.chart.padding.left - narwhal.options.chart.padding.right;

            expect(narwhal.options.chart.padding.left).toBeGreaterThan(0);
            expect(narwhal.options.chart.plotWidth).toEqual(x);
        });

        describe('rangeBand (width of each x axis band)', function () {
            it('should be set default to 0 (rangePoint)', function () {
                createNarwhal().data([1,2,3]).render();
                expect(narwhal.rangeBand).toBe(0);
            });
        });


    });

});
