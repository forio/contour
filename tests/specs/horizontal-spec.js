describe('Horizontal frame', function () {
    var $el, el;
    var narwhal;

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createNarwhal(options) {
        options = _.extend({ el: el }, options);
        narwhal = new Narwhal(options);
        return narwhal;
    }

    describe('render', function () {
        beforeEach(function () {
            var options = {
                yAxis: {
                    smartAxis: false,
                    title: 'A'
                },

                xAxis: {
                    firstAndLast: false,
                    title: 'B'
                }
            };

            createNarwhal(options)
                .cartesian()
                .horizontal();
        });

        describe('yScale', function () {
            it('should go from 0 to width', function () {
                narwhal.data([1,2,3]).render();
                var w = narwhal.options.chart.plotWidth;

                expect(narwhal.yScale(0)).toBe(0);
                expect(narwhal.yScale(3)).toBe(w);
            });

        });

        describe('xScale', function () {
            it('should be inverted (first index should be below --greater Y coord-- then the last index)', function () {
                narwhal.data([1,2,3]).render();

                expect(narwhal.xScale(0)).toBeGreaterThan(narwhal.xScale(2));
            });
        });

        describe('yAxis', function () {
            it('should render the horizontal axis titles below the axis labels', function () {
                narwhal.render();

                var textBounds = _.nw.textBounds('ABC', '.y.tick');
                var title = $el.find('.y.axis-title');
                expect(+title.attr('y')).toBeGreaterThan(textBounds.height);
            });
        });


        describe('xAxis', function () {
            it('should render the vertical axis titles to the left of the axis labels', function () {
                narwhal.render();

                var textBounds = _.nw.textBounds('ABC', '.x.tick');
                var title = $el.find('.x.axis-title');
                expect(+title.attr('x')).toBeLessThan(textBounds.width);
            });
        });
    });

});
