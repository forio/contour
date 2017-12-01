describe('Bar chart', function () {

    var el, $el, nw;
    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createinstance(options) {
        options = Object.assign({ el: el, chart: { animations: false } }, options);
        var instance = new Contour(options).cartesian().horizontal();
        return instance;
    }

    describe('given simple data', function () {
        var data = [];
        beforeEach(function () {
            data = [1,2,3];
        });

        it('should create one rect per data point', function () {
            createinstance().bar(data).render();
            var rects = $el.find('rect.bar');
            expect(rects.length).toBe(3);
        });

        it('should add the Bar class to each Bar', function () {
            createinstance().bar(data).render();
            var rects = $el.find('rect.bar');

            expect(rects.filter('.bar').length).toBe(3);
        });


        it('with tooltips enabled should add the tooltip-tracker class to each Bar', function () {
            createinstance({tooltip: { enable: true }}).bar(data).render();
            var rects = $el.find('rect.bar');

            expect(rects.filter('.tooltip-tracker').length).toBe(3);
        });

        it('with tooltips disabled should add the tooltip-tracker class to each Bar', function () {
            createinstance({tooltip: { enable: false }}).bar(data).render();
            var rects = $el.find('rect.bar');

            expect(rects.filter('.tooltip-tracker').length).toBe(0);
        });

        it('should set the width of each Bar to the corresponding yScale value', function () {
            var nw = createinstance().bar(data).render();
            var rects = $el.find('rect.bar');
            var x = function (d) { return nw.yScale(d); };

            expect(+rects.eq(0).attr('width')).toBe(x(data[0]));
            expect(+rects.eq(1).attr('width')).toBe(x(data[1]));
            expect(+rects.eq(2).attr('width')).toBe(x(data[2]));
        });
    });

    describe('given multiple series', function () {
        var data;
        beforeEach(function () {
            jasmine.addMatchers({
                toHaveUniqeYCoord: function (util, tester) {
                    return {
                        compare: function (actual, expected) {
                            var notText = this.isNot ? '(not) ' : '';
                            this.message = function () { return 'Expected '+ notText + expected + ' uniq Y corrdinates and got ' + uniq.length + ' different ones: [' + uniq.join() +']'; };
                            var yCoords = {};
                            var uniq = [];
                            actual.each(function () {
                                var key = $(this).attr('y');
                                if(!yCoords[key]) {
                                    yCoords[key] = true;
                                    uniq.push(key);
                                }
                            });

                            var passed = uniq.length === expected;

                            return {
                                pass: passed,
                                message: 'Expected ' + actual + (passed ? '' : ' not') + ' to equal ' + expected
                            };
                        }
                    };

                },

                toAllHaveDifferentYCoord: function () {
                    return {
                        compare: function (actual, expected) {
                            var notText = this.isNot ? ' not' : '';
                            message = function () { return 'Expected all to' + notText + ' have different Y coordinates'; };
                            var yCoords = {};
                            var correct = true;
                            actual.each(function () {
                                var key = $(this).attr('y');
                                if(!yCoords[key])
                                    yCoords[key] = true;
                                else
                                    correct = false;
                            });

                            return {
                                pass: correct,
                                message: message()
                            };
                        }
                    };
                }
            });

            data = [
                { name: 's1', data: [1,2,3] },
                { name: 's2', data: [4,4,4] }
            ];


        });

        describe('without stacking', function () {
            beforeEach(function () {
                nw = createinstance().bar([
                    { name: 's1', data: [1,2,3] },
                    { name: 's2', data: [4,4,4] }
                ]).render();


            });

            it('should render one bar per data point on different y\'s', function () {
                var rects = $el.find('rect.bar');

                expect(rects).toAllHaveDifferentYCoord();
            });
        });

        describe('with stacking', function () {
            beforeEach(function () {
                nw = createinstance().bar([
                    { name: 's1', data: [1,2,3] },
                    { name: 's2', data: [4,4,4] }
                ], { stacked: true }).render();


            });

            it('should render one bar per category', function () {
                var rects = $el.find('rect.bar');
                expect(rects).toHaveUniqeYCoord(3);
            });
        });

    });

    describe('given multiple series with uneven data (ie. null values in some series)', function () {
        beforeEach(function () {
            nw = createinstance().bar([
                { name: 's1', data: [1,null,3] },
                { name: 's2', data: [4,5,3] },
                { name: 's3', data: [4,null,4] }
            ]).render();
        });

        it('should behave correctly', function () {
            var rects = [].filter.call($el.find('rect.bar'), function (r) { return +$(r).attr('width') > 0; });
            expect(rects.length).toBe(7);
        });

    });


});
