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

    describe('default yAxis', function () {
        beforeEach(function () {
            narwhal = createNarwhal();
        });

        it('should show only first and last ticks', function () {
            narwhal.data([0,10,20,30]).render();
            expect($el.find('.y.axis .tick.major').length).toBe(2);
        });

        it('should merge options.yAxis.max as a tick', function () {
            narwhal = createNarwhal({ yAxis: { max: 100 }});
            narwhal.data([0,10,20,30]).render();
            var ticks = $el.find('.y.axis .tick.major');
            expect(ticks.length).toBe(3);

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

            target.options.visualizations.push(mock.render);
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
