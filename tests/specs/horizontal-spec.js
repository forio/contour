describe('Horizontal frame', function () {
    var $el, el;
    var contour;

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createContour(options) {
        options = _.extend({ el: el }, options);
        contour = new Contour(options);
        return contour;
    }

    describe('constructor', function () {
        it('should ensure rotatedFrame is set to true', function () {
            var contour = createContour({ chart: { rotatedFrame: false }}).cartesian().horizontal();
            expect(contour.options.chart.rotatedFrame).toBe(true);
        });
    });

    describe('render', function () {
        beforeEach(function () {
            var options = {
                yAxis: {
                    scaling: {
                        smartAxis: false
                    },
                    title: 'A'
                },
                xAxis: {
                    firstAndLast: false,
                    title: 'B'
                }
            };

            createContour(options)
                .cartesian()
                .horizontal();
        });

        describe('yScale', function () {
            it('should go from 0 to width', function () {
                contour.nullVis([1,2,3]).render();
                var w = contour.options.chart.plotWidth;

                expect(contour.yScale(0)).toBe(0);
                expect(contour.yScale(3)).toBe(w);
            });

        });

        describe('xScale', function () {
            it('should be inverted (first index should be below --greater Y coord-- then the last index)', function () {
                contour.nullVis([1,2,3]).render();

                expect(contour.xScale(0)).toBeGreaterThan(contour.xScale(2));
            });
        });

        describe('yAxis', function () {
            it('should render the horizontal axis titles below the axis labels', function () {
                contour.render();

                var textBounds = _.nw.textBounds('ABC', '.y.tick');
                var title = $el.find('.y.axis-title');
                expect(+title.attr('y')).toBeGreaterThan(textBounds.height);
            });
        });


        describe('xAxis', function () {
            it('should render the vertical axis titles to the left of the axis labels', function () {
                contour.render();

                var textBounds = _.nw.textBounds('ABC', '.x.tick');
                var title = $el.find('.x.axis-title');
                expect(+title.attr('x')).toBeLessThan(textBounds.width);
            });
        });
    });

});
