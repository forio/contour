describe('Cartesian frame', function () {
    var $el, el;
    var narwhal;


    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createNarwhal(options) {
        $el = $('<div>');
        el = $el.get(0);
        options = _.extend({ el: el }, options);

        narwhal = new Narwhal(options).cartesian();
        return narwhal;
    }

    it('should expose "cartesian" constructor function', function () {
        expect(Narwhal.prototype.cartesian).toBeDefined();
    });

    describe('constructor', function () {
        it('should throw if no data is set', function () {
            var narwhal = createNarwhal();
            expect(narwhal.render).toThrow();
        });

        it('should ensure rotatedFrame is set to false', function () {
            var _opt;
            Narwhal.export('test', function (layer, data, options) {
                _opt = options;
            });
            createNarwhal({ chart: { rotatedFrame: true }}).test([]).render();
            expect(_opt.chart.rotatedFrame).toBe(false);
        });
    });

    function assert_hasDefaultEmptyYScale(narwhal, maxValue) {
        var h = narwhal.options.chart.plotHeight;
        maxValue = maxValue || 10;

        expect(narwhal.yScale(0)).toEqual(h);
        expect(narwhal.yScale(maxValue)).toEqual(0);
    }

    it('without data should provide default axis', function () {
        var narwhal = createNarwhal().render();
        // default y Axis goes from 0 to 10
        assert_hasDefaultEmptyYScale(narwhal, 10);
    });

    it('with empty array data should provide default axis', function () {
        var narwhal = createNarwhal().nullVis([]).render();

        assert_hasDefaultEmptyYScale(narwhal);
    });

    describe('with simple array data', function () {
        it('should auto generate categories and add x values as category strings', function () {
            var narwhal = createNarwhal();
            narwhal.nullVis([10,20,30]).render();

            expect(narwhal.dataSrc).toBeDefined();
            expect(narwhal.dataSrc[0].x).toBe(0);
            expect(narwhal.dataSrc[1].x).toBe(1);
            expect(narwhal.dataSrc[2].x).toBe(2);
        });
    });

    describe('width categories array', function () {
        it('should override the x axis type to be ordinal', function () {
            var narwhal = createNarwhal({xAxis: { type: 'linear', categories: [1,2,3,4] }});
            narwhal.render();

            expect(narwhal.xScale.rangeRoundBands).toBeDefined();
        });
    });

    describe('datum', function () {
        it('should handle the case of normalzing an array of data', function () {
            var _data;
            Narwhal.export('normalizeData', function (data, layer, options) {
                _data = data;
            });
            var narwhal = createNarwhal().normalizeData([1,2,3]).render();

            expect(_data[0].data[0]).toEqual({y:1, x: 0});
        });
    });


    describe('default xScale', function () {
        beforeEach(function () {
            narwhal = createNarwhal();
        });

        it('should be an ordinal/linear scaling', function () {
            narwhal = createNarwhal({chart: { width: 131 } , xAxis: { innerRangePadding: 0, outerRangePadding: 0 }});
            narwhal.nullVis([0,1,2,3,4,5,6,7,8,9]).render();

            // this distance should be constant for all
            var dist = narwhal.xScale(1) - narwhal.xScale(0);
            expect(narwhal.xScale(2)).toEqual(narwhal.xScale(1) + dist);
            expect(narwhal.xScale(3)).toEqual(narwhal.xScale(2) + dist);
            expect(narwhal.xScale(4)).toEqual(narwhal.xScale(3) + dist);
            expect(narwhal.xScale(5)).toEqual(narwhal.xScale(4) + dist);
            expect(narwhal.xScale(6)).toEqual(narwhal.xScale(5) + dist);
            expect(narwhal.xScale(7)).toEqual(narwhal.xScale(6) + dist);
            expect(narwhal.xScale(8)).toEqual(narwhal.xScale(7) + dist);
            expect(narwhal.xScale(9)).toEqual(narwhal.xScale(8) + dist);
        });
    });



    describe('default yScale', function () {
        beforeEach(function () {
            narwhal = createNarwhal();
        });

        // we need to find the correct values for the now code
        xit('should be an inverted linear scaling', function () {
            // the 'nice rounding' for the max y value, makes it
            // that the top value of the chart is 50 for the following data
            narwhal.nullVis([0,10,20,30,40,49]).render();
            var h = narwhal.options.chart.plotHeight;

            expect(narwhal.yScale(0)).toEqual(h);
            expect(narwhal.yScale(25)).toEqual(h/2);
            expect(narwhal.yScale(50)).toEqual(0);
        });
    });




    describe('default', function () {
        describe('yAxis title', function () {
            it('should be included if specificed in the options', function () {
                narwhal = createNarwhal({ yAxis: { title: 'yAxis' } });
                narwhal.nullVis([1,2,3]).render();
                titles = $el.find('.y.axis-title');
                expect(titles.length).toBe(1);
                expect(titles.text()).toBe('yAxis');
            });

            it('should NOT be included if NOT specificed in the options', function () {
                narwhal = createNarwhal({ yAxis: { title: '' } });
                narwhal.nullVis([1,2,3]).render();
                titles = $el.find('.axis-title');
                expect(titles.length).toBe(0);
            });

        });
    });

    describe('render', function () {
        // this should be in the render, because is data dependent
        it('should provide scaling function (xScale & yScale) for visualizations to use', function () {
            var target = createNarwhal()
                .nullVis([1,2,3])
                .render();

            expect(target.xScale).toBeDefined();
            expect(target.yScale).toBeDefined();
        });

        it('should call visualizations to render!', function () {
            var mock = { render: function () { }};
            var target = createNarwhal();
            spyOn(mock, 'render');

            Narwhal.export('something', mock.render);
            target.nullVis([1,2]).something().render();

            expect(mock.render).toHaveBeenCalled();
        });

        it('should render an xAxis at the bottom of the chart', function () {
            createNarwhal().nullVis([1,2,3]).render();
            var axis = $el.find('.x.axis');
            var y = narwhal.options.chart.plotHeight + narwhal.options.chart.padding.top;
            var x = narwhal.options.chart.padding.left;

            expect(axis.length).toEqual(1);
            expect(axis.attr('transform')).toEqual('translate(' + x + ',' + y + ')');
        });

        it('should adjust bottom padding and plot height to fit the xAxis and labels', function () {
            createNarwhal().nullVis([1,2,3]).render();
            var y = narwhal.options.chart.height - narwhal.options.chart.padding.bottom - narwhal.options.chart.padding.top;

            expect(narwhal.options.chart.padding.bottom).toBeGreaterThan(0);
            expect(narwhal.options.chart.plotHeight).toEqual(y);
        });

        it('should render an yAxis at the left of the chart', function () {
            createNarwhal().nullVis([1,2,3]).render();
            var axis = $el.find('.y.axis');
            var x = narwhal.options.chart.padding.left;
            var y = narwhal.options.chart.padding.top;

            expect(axis.length).toEqual(1);
            expect(axis.attr('transform')).toEqual('translate(' + x + ',' + y + ')');
        });

        it('should position the yAxis at the left with some padding', function () {
            createNarwhal().nullVis([1,2,3]).render();
            var x = narwhal.options.chart.width - narwhal.options.chart.padding.left - narwhal.options.chart.padding.right;

            expect(narwhal.options.chart.padding.left).toBeGreaterThan(0);
            expect(narwhal.options.chart.plotWidth).toEqual(x);
        });

        describe('rangeBand (width of each x axis band)', function () {
            // not sure what it should be the default...
            // changed the defult to be a ordinal with rangeBands...
            xit('should be set default to 0 (rangePoint)', function () {
                createNarwhal().nullVis([1,2,3]).render();
                expect(narwhal.rangeBand).toBe(0);
            });
        });

        it('should render visualizations after all axis and other elements (zindex)', function () {
            createNarwhal().nullVis([1,2,3]);
            Narwhal.export('something_zindex', function (data, layer) {
                // add a dummy svg element
                layer.attr('name', 'myDummyVisualization');
            });

            narwhal.something_zindex().render();

            var dummy = $(narwhal.svg[0]).children().last();
            expect(dummy.attr('name')).toBe('myDummyVisualization');
        });

    });

    describe('Grid lines', function () {

        beforeEach(function () {
            narwhal = null;
        });

        it('should render horizontal gridLines width gridlines turned on', function () {
            createNarwhal({
                chart: {
                    gridlines: 'horizontal'
                },
                yAxis: {
                    smartAxis: false
                }
            }).nullVis([10,20,30]);

            narwhal.render();

            // should render 1 horizontal line per tick (except 0 wich is the x axis)
            // for data 10,20,30 we get ticks every 5 so 5,10,15,20,25,30
            expect($el.find('.y.axis .grid-line').length).toBe(6);
        });

        it('should render only gridlines at ticks for smart axis', function () {
            createNarwhal({
                chart: {
                    gridlines: 'horizontal'
                },

                yAxis: {
                    smartAxis: false,
                }
            }).nullVis([10,20,30]);

            narwhal.render();

            expect($el.find('.y.axis .grid-line').length).toBe(6);

        });

        it('when vertical turned on should render vertical gridLines for only for the first and last categories when firstAndLast is turned on', function () {
            createNarwhal({
                chart: {
                    gridlines: 'vertical'
                },
                xAxis: {
                    categories: ['red', 'green', 'blue'],
                    firstAndLast: true,
                }
            }).nullVis([10,20,30]);

            narwhal.render();

            expect($el.find('.x.axis .grid-line').length).toBe(2);
        });


        it('when vertical turned on should render vertical gridLines for all x values when turned on with firstAndLast turned off', function () {
            createNarwhal({
                chart: {
                    gridlines: 'vertical'
                },
                xAxis: {
                    categories: ['red', 'green', 'blue'],
                    firstAndLast: false,
                }
            }).nullVis([10,20,30]);

            narwhal.render();

            expect($el.find('.x.axis .grid-line').length).toBe(3);
        });


        it('when vertical turned on should render vertical gridLines for all x values with linear x axis', function () {
            createNarwhal({
                chart: {
                    gridlines: 'vertical'
                },
                xAxis: {
                    type: 'linear',
                    firstAndLast: false,
                }
            })
            /* this data gives a tick every 0.5, total 9 (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4) */
            .nullVis([10,20,30, 40, 50]);

            narwhal.render();

            /* we don't render grid line at the origin x=0 so we should get 8 gridlines */
            expect($el.find('.x.axis .grid-line').length).toBe(8);
        });
    });

});
