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
        it('should throw if no data is set', function () {
            var narwhal = createNarwhal();
            expect(narwhal.render).toThrow();
        });
    });

    function assert_hasDefaultEmptyYScale(narwhal) {
        var h = narwhal.options.chart.plotHeight;

        expect(narwhal.yScale(0)).toEqual(h);
        expect(narwhal.yScale(10)).toEqual(0);
    }

    it('without data should provide default axis', function () {
        var narwhal = createNarwhal().render();

        assert_hasDefaultEmptyYScale(narwhal);
    });

    it('with empty array data should provide default axis', function () {
        var narwhal = createNarwhal().data([]).render();

        assert_hasDefaultEmptyYScale(narwhal);
    });

    describe('with simple array data', function () {
        it('should auto generate categories and add x values as category strings', function () {
            var narwhal = createNarwhal();
            narwhal.data([10,20,30]).render();

            expect(narwhal.dataSrc).toBeDefined();
            expect(narwhal.dataSrc[0].x).toBe(0);
            expect(narwhal.dataSrc[1].x).toBe(1);
            expect(narwhal.dataSrc[2].x).toBe(2);
        });
    });

    describe('datum', function () {
        it('should handle the case of normalzing an array of data', function () {
            var narwhal = createNarwhal();
            var datums = narwhal.datum({ name: 'series name', data: [1,2,3]});
            expect(datums[0]).toEqual({y:1, x: 0});
        });
    });


    describe('default xScale', function () {
        beforeEach(function () {
            narwhal = createNarwhal();
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

        // we need to find the correct values for the now code
        xit('should be an inverted linear scaling', function () {
            // the 'nice rounding' for the max y value, makes it
            // that the top value of the chart is 50 for the following data
            narwhal.data([0,10,20,30,40,49]).render();
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
                narwhal.data([1,2,3]).render();
                titles = $el.find('.y.axis-title');
                expect(titles.length).toBe(1);
                expect(titles.text()).toBe('yAxis');
            });

            it('should NOT be included if NOT specificed in the options', function () {
                narwhal = createNarwhal({ yAxis: { title: '' } });
                narwhal.data([1,2,3]).render();
                titles = $el.find('.axis-title');
                expect(titles.length).toBe(0);
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
            // not sure what it should be the default...
            // changed the defult to be a ordinal with rangeBands...
            xit('should be set default to 0 (rangePoint)', function () {
                createNarwhal().data([1,2,3]).render();
                expect(narwhal.rangeBand).toBe(0);
            });
        });

        it('should render visualizations after all axis and other elements (zindex)', function () {
            createNarwhal().data([1,2,3]);
            narwhal.visualizations.push(function (layer) {
                // add a dummy svg element
                layer.attr('name', 'myDummyVisualization');
            });

            narwhal.render();

            var dummy = $(narwhal.svg[0]).children().last();
            expect(dummy.attr('name')).toBe('myDummyVisualization');
        });

    });

    describe('Grid lines', function () {

        it('should render horizontal gridLines width gridlines turned on', function () {
            createNarwhal({
                chart: {
                    gridlines: 'horizontal'
                }
            }).data([10,20,30]);

            narwhal.render();

            expect($el.find('.y.axis .grid-line').length).toBe(1);
        });

        it('should render only gridlines at ticks for smart axis', function () {
            createNarwhal({
                chart: {
                    gridlines: 'horizontal'
                },

                yAxis: {
                    smartAxis: false,
                }
            }).data([10,20,30]);

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
            }).data([10,20,30]);

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
            }).data([10,20,30]);

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
            .data([10,20,30, 40, 50]);

            narwhal.render();

            /* we don't render grid line at the origin x=0 so we should get 8 gridlines */
            expect($el.find('.x.axis .grid-line').length).toBe(8);
        });
    });

});
