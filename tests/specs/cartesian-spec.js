describe('Cartesian frame', function () {
    var $el, el;
    var instance;


    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createinstance(options) {
        $el = $('<div>');
        el = $el.get(0);
        options = Object.assign({ el: el, chart: { animations: { enable: false } } }, options);

        instance = new Contour(options).cartesian();
        return instance;
    }

    it('should expose "cartesian" constructor function', function () {
        expect(Contour.prototype.cartesian).toBeDefined();
    });

    describe('constructor', function () {
        it('should throw if no data is set', function () {
            var instance = createinstance();
            expect(instance.render).toThrow();
        });

        it('should ensure rotatedFrame is set to false', function () {
            var _opt;
            Contour.export('test', function (layer, data, options) {
                _opt = options;
            });
            createinstance({ chart: { rotatedFrame: true }}).test([]).render();
            expect(_opt.chart.rotatedFrame).toBe(false);
        });
    });

    function assert_hasDefaultEmptyYScale(instance, maxValue) {
        var h = instance.options.chart.plotHeight;
        maxValue = maxValue || 10;

        expect(instance.yScale(0)).toEqual(h);
        expect(instance.yScale(maxValue)).toEqual(0);
    }

    it('without data should provide default axis', function () {
        var instance = createinstance().render();
        // default y Axis goes from 0 to 10
        assert_hasDefaultEmptyYScale(instance, 10);
    });

    it('with empty array data should provide default axis', function () {
        var instance = createinstance().nullVis([]).render();

        assert_hasDefaultEmptyYScale(instance);
    });

    describe('with simple array data', function () {
        it('should auto generate categories and add x values as category strings', function () {
            var instance = createinstance();
            instance.nullVis([10,20,30]).render();

            expect(instance.dataSrc).toBeDefined();
            expect(instance.dataSrc[0].x).toBe(0);
            expect(instance.dataSrc[1].x).toBe(1);
            expect(instance.dataSrc[2].x).toBe(2);
        });

        it('with string x values in all data, should copy categories to xAxis.categories', function () {
            var instance = createinstance();
            instance.nullVis([{x:'a', y:1}, {x:'b', y: 2}]).render();

            expect(instance.options.xAxis.categories).toBeDefined();
            expect(instance.options.xAxis.categories[0]).toBe('a');
            expect(instance.options.xAxis.categories[1]).toBe('b');
        });

    });

    describe('with categories array', function () {
        it('should override the x axis type to be ordinal', function () {
            var instance = createinstance({
                xAxis: { type: 'linear', categories: [1,2,3,4] }
            });
            instance.render();

            expect(instance.xScale.rangeRoundBands).toBeDefined();
        });
    });

    describe('datum', function () {
        it('should handle the case of normalzing an array of data', function () {
            var _data;
            Contour.export('normalizeData', function (data, layer, options) {
                _data = data;
            });
            var instance = createinstance().normalizeData([1,2,3]).render();

            expect(_data[0].data[0]).toEqual({y:1, x: 0});
        });
    });


    describe('default xScale', function () {
        beforeEach(function () {
            instance = createinstance();
        });

        it('should be an ordinal/linear scaling', function () {
            instance = createinstance({chart: { width: 131 } , xAxis: { innerRangePadding: 0, outerRangePadding: 0 }});
            instance.nullVis([0,1,2,3,4,5,6,7,8,9]).render();

            // this distance should be constant for all
            var dist = instance.xScale(1) - instance.xScale(0);
            expect(instance.xScale(2)).toEqual(instance.xScale(1) + dist);
            expect(instance.xScale(3)).toEqual(instance.xScale(2) + dist);
            expect(instance.xScale(4)).toEqual(instance.xScale(3) + dist);
            expect(instance.xScale(5)).toEqual(instance.xScale(4) + dist);
            expect(instance.xScale(6)).toEqual(instance.xScale(5) + dist);
            expect(instance.xScale(7)).toEqual(instance.xScale(6) + dist);
            expect(instance.xScale(8)).toEqual(instance.xScale(7) + dist);
            expect(instance.xScale(9)).toEqual(instance.xScale(8) + dist);
        });
    });



    describe('default yScale', function () {
        beforeEach(function () {
            instance = createinstance();
        });

        // we need to find the correct values for the now code
        xit('should be an inverted linear scaling', function () {
            // the 'nice rounding' for the max y value, makes it
            // that the top value of the chart is 50 for the following data
            instance.nullVis([0,10,20,30,40,49]).render();
            var h = instance.options.chart.plotHeight;

            expect(instance.yScale(0)).toEqual(h);
            expect(instance.yScale(25)).toEqual(h/2);
            expect(instance.yScale(50)).toEqual(0);
        });

        it('should use extent of tick values for min and max if provided', function () {
            var nw = createinstance({
                yAxis: { tickValues: [4,8] }
            });
            nw.nullVis([1, 2, 4, 5, 6, 8]).render();

            var h = nw.options.chart.plotHeight;
            expect(nw.yScale(0)).toEqual(h);
            expect(nw.yScale(4)).toEqual(h/2);
            expect(nw.yScale(8)).toEqual(0);

            var text = $el.find('.y.axis .tick text');

            // var text = yLables.find('text');
            expect(text.length).toBe(2);
            expect(d3.select(text[0]).text()).toBe('4');
            expect(d3.select(text[1]).text()).toBe('8');
        });

        it('should use options.min as absolute min even with tick values', function () {
            var nw = createinstance({
                yAxis: { tickValues: [4,8], min: 5 }
            });
            nw.nullVis([4, 5, 6, 8]).render();
            var h = nw.options.chart.plotHeight;
            expect(nw.yScale(5)).toEqual(h);
        });

        it('should use options.max as absolute max even with tick values', function () {
            var nw = createinstance({
                yAxis: { tickValues: [4,8], max: 7 }
            });
            nw.nullVis([4, 5, 6, 8]).render();
            var h = nw.options.chart.plotHeight;

            expect(nw.yScale(7)).toEqual(0);
        });

        it('should use options.min and options.max as domain range even with tick values', function () {
            var nw = createinstance({
                yAxis: { tickValues: [4,8], max: 7, min: 5 }
            });
            nw.nullVis([4, 5, 6, 8]).render();
            var h = nw.options.chart.plotHeight;
            expect(nw.yScale(5)).toEqual(h);
            expect(nw.yScale(7)).toEqual(0);
        });
    });




    describe('default', function () {
        describe('yAxis title', function () {
            it('should be included if specificed in the options', function () {
                instance = createinstance({ yAxis: { title: 'yAxis' } });
                instance.nullVis([1,2,3]).render();
                titles = $el.find('.y.axis-title');
                expect(titles.length).toBe(1);
                expect(titles.text()).toBe('yAxis');
            });

            it('should NOT be included if NOT specificed in the options', function () {
                instance = createinstance({ yAxis: { title: '' } });
                instance.nullVis([1,2,3]).render();
                titles = $el.find('.axis-title');
                expect(titles.length).toBe(0);
            });

        });
    });

    describe('render', function () {
        // this should be in the render, because is data dependent
        it('should provide scaling function (xScale & yScale) for visualizations to use', function () {
            var target = createinstance()
                .nullVis([1,2,3])
                .render();

            expect(target.xScale).toBeDefined();
            expect(target.yScale).toBeDefined();
        });

        it('should call visualizations to render!', function () {
            var mock = { render: function () { }};
            var target = createinstance();
            spyOn(mock, 'render');

            Contour.export('something', mock.render);
            target.nullVis([1,2]).something().render();

            expect(mock.render).toHaveBeenCalled();
        });

        it('should render an xAxis at the bottom of the chart', function () {
            createinstance().nullVis([1,2,3]).render();
            var axis = $el.find('.x.axis');
            var y = instance.options.chart.plotHeight + instance.options.chart.padding.top;
            var x = instance.options.chart.internalPadding.left;

            expect(axis.length).toEqual(1);
            expect(axis.attr('transform')).toEqual('translate(' + x + ',' + y + ')');
        });

        it('should adjust bottom padding and plot height to fit the xAxis and labels', function () {
            createinstance().nullVis([1,2,3]).render();
            var y = instance.options.chart.height - instance.options.chart.internalPadding.bottom - instance.options.chart.padding.top;

            expect(instance.options.chart.internalPadding.bottom).toBeGreaterThan(0);
            expect(instance.options.chart.plotHeight).toEqual(y);
        });

        it('should render an yAxis at the left of the chart', function () {
            createinstance().nullVis([1,2,3]).render();
            var axis = $el.find('.y.axis');
            var x = instance.options.chart.internalPadding.left;
            var y = instance.options.chart.padding.top;

            expect(axis.length).toEqual(1);
            expect(axis.attr('transform')).toEqual('translate(' + x + ',' + y + ')');
        });

        it('should position the yAxis at the left with some padding', function () {
            createinstance().nullVis([1,2,3]).render();
            var x = instance.options.chart.width - instance.options.chart.internalPadding.left - instance.options.chart.padding.right;

            expect(instance.options.chart.internalPadding.left).toBeGreaterThan(0);
            expect(instance.options.chart.plotWidth).toEqual(x);
        });

        describe('rangeBand (width of each x axis band)', function () {
            // not sure what it should be the default...
            // changed the defult to be a ordinal with rangeBands...
            xit('should be set default to 0 (rangePoint)', function () {
                createinstance().nullVis([1,2,3]).render();
                expect(instance.rangeBand).toBe(0);
            });
        });

        it('should render visualizations after all axis and other elements (zindex)', function () {
            createinstance().nullVis([1,2,3]);
            Contour.export('something_zindex', function (data, layer) {
                // add a dummy svg element
                layer.attr('name', 'myDummyVisualization');
            });

            instance.something_zindex().render();

            var dummy = $(instance.svg[0]).children().last();
            expect(dummy.attr('name')).toBe('myDummyVisualization');
        });

    });

    describe('Grid lines', function () {

        beforeEach(function () {
            instance = null;
        });

        var getNumTicks = function () {
            return $el.find('.y.axis .tick').length;
        };

        it('should render horizontal gridLines when gridlines are turned on', function () {
            createinstance({
                chart: {
                    gridlines: 'horizontal'
                },
                yAxis: {
                    scaling: {
                        smartAxis: false
                    }
                }
            }).nullVis([10,20,30]);

            instance.render();

            // should render 1 horizontal line per tick (except 0 which is the x axis)
            // for data 10,20,30 we get ticks every 6 so 6, 12, 18, 24, 30
            expect($el.find('.y.axis .grid-line').length).toBe(getNumTicks() - 1);
        });

        it('should render only gridlines at ticks for smart axis', function () {
            createinstance({
                chart: {
                    gridlines: 'horizontal'
                },

                yAxis: {
                    scaling: {
                        smartAxis: false
                    }
                }
            }).nullVis([10,20,30]);

            instance.render();

            expect($el.find('.y.axis .grid-line').length).toBe(getNumTicks() - 1);

        });

        it('when vertical turned on should render vertical gridLines for only for the first and last categories when firstAndLast is turned on', function () {
            createinstance({
                chart: {
                    gridlines: 'vertical'
                },
                xAxis: {
                    categories: ['red', 'green', 'blue'],
                    firstAndLast: true,
                }
            }).nullVis([10,20,30]);

            instance.render();

            expect($el.find('.x.axis .grid-line').length).toBe(2);
        });


        it('when vertical turned on should render vertical gridLines for all x values when turned on with firstAndLast turned off', function () {
            createinstance({
                chart: {
                    gridlines: 'vertical'
                },
                xAxis: {
                    categories: ['red', 'green', 'blue'],
                    firstAndLast: false,
                }
            }).nullVis([10,20,30]);

            instance.render();

            expect($el.find('.x.axis .grid-line').length).toBe(3);
        });


        it('when vertical turned on should render vertical gridLines for all x values with linear x axis', function () {
            createinstance({
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

            instance.render();

            /* we don't render grid line at the origin x=0 so we should get 8 gridlines */
            expect($el.find('.x.axis .grid-line').length).toBe(8);
        });
    });

});
