describe('utils', function () {
    describe('dateDiff', function () {
        it('should return the difference in days of two dates', function () {
            var d1 = new Date('2010-01-01T10:00:00Z');
            var d2 = new Date('2010-01-02T10:00:00Z');

            expect(_.nw.dateDiff(d2, d1)).toBe(1);
        });
    });

    describe('roundToNearest', function () {
        it('should round the given number to the neares specified multiple', function () {
            expect(_.nw.roundToNearest(7, 14)).toBe(14);
            expect(_.nw.roundToNearest(7, 10)).toBe(10);
        });
    });

    describe('roundToNextTick', function () {
        describe('for negative numbers', function () {

            describe('for decimal numbers', function () {
                it('with 1 significant digit, it shold round to nearest multiple of .2', function () {
                    expect(_.nw.roundToNextTick(-0.3)).toBe(-0.4);
                });
                it('with 2 significant digit, it shold round to nearest multiple of .1', function () {
                    expect(_.nw.roundToNextTick(-0.32)).toBe(-0.4);
                });
                it('with 3 significant digit, it shold round to nearest multiple of .01', function () {
                    expect(_.nw.roundToNextTick(-0.567)).toBe(-0.57);
                });
            });

            it('for single digit numbers should round nearest multiple of 2', function () {
                expect(_.nw.roundToNextTick(-3.4)).toBe(-4);
                expect(_.nw.roundToNextTick(-3.6)).toBe(-4);
            });

            describe('for two digit numbers', function () {
                it('should round to next multiple of 2', function () {
                    expect(_.nw.roundToNextTick(-22.5)).toBe(-24);
                });
            });

            describe('for three digits and up', function () {
                it('it should round to next multiple of 10', function () {
                    expect(_.nw.roundToNextTick(-223.5)).toBe(-230);
                    expect(_.nw.roundToNextTick(-1223.5)).toBe(-1300);
                    expect(_.nw.roundToNextTick(-198)).toBe(-200);
                    expect(_.nw.roundToNextTick(-998)).toBe(-1000);
                });
            });

        });

        describe('for positive numebrs', function () {
            describe('for decimal numbers', function () {
                it('with 1 significant digit, it shold round to nearest multiple of .2', function () {
                    expect(_.nw.roundToNextTick(0.3)).toBe(0.4);
                });
                it('with 2 significant digit, it shold round to nearest multiple of .1', function () {
                    expect(_.nw.roundToNextTick(0.32)).toBe(0.4);
                });
                it('with 3 significant digit, it shold round to nearest multiple of .01', function () {
                    expect(_.nw.roundToNextTick(0.567)).toBe(0.57);
                });
            });

            it('for single digit numbers should round to the next multiple of 2', function () {
                expect(_.nw.roundToNextTick(3.4)).toBe(4);
                expect(_.nw.roundToNextTick(3.6)).toBe(4);
            });

            describe('for two digit numbers', function () {
                it('should round to next multiple of 2', function () {
                    expect(_.nw.roundToNextTick(22.5)).toBe(24);
                });
            });

            describe('for three digits and up', function () {
                it('it should round to next multiple of 10', function () {
                    expect(_.nw.roundToNextTick(223.5)).toBe(230);
                    expect(_.nw.roundToNextTick(1223.5)).toBe(1300);
                    expect(_.nw.roundToNextTick(198)).toBe(200);
                    expect(_.nw.roundToNextTick(998)).toBe(1000);
                });
            });
        });

    });

    describe('maxTickValues', function () {
        it('should return domain if domain length is less then maxTicks', function () {
            var domain = [1,2,3];
            expect(_.nw.maxTickValues(5, domain)).toEqual([1,2,3]);
        });

        it('should return domain if domain is empty', function () {
            var domain = [];
            expect(_.nw.maxTickValues(5, domain)).toEqual([]);
        });

        it('should return domain if domain length is equal to maxTicks', function () {
            var domain = [1,2,3];
            expect(_.nw.maxTickValues(3, domain)).toEqual([1,2,3]);
        });

        describe('when maxTicks is less than domain length', function () {
            var ticks;
            var domain = [1,2,3,4,5,6,7,8,9,10];
            var maxTicks = 4;

            beforeEach(function () {
                ticks = _.nw.maxTickValues(maxTicks, domain);
            });

            it('should return maxTicks as the length of the ticks array', function () {
                expect(ticks.length).toBe(maxTicks);
            });

            it('should return the first domain elements as tick', function () {
                expect(ticks[0]).toEqual(domain[0]);
            });

            it('should return evenly spaced ticks', function () {
                ticks = _.nw.maxTickValues(5, domain);
                expect(ticks).toEqual([1,3,5,7,9]);
            });

        });
    });

    describe('normalizeSeries', function () {

        beforeEach(function () {
            var isSeriesSorted = function (actual) {
                var isSorted = true;
                _.each(actual, function (series) {
                    if (!series.data.length || !isSorted) return;
                    var prev = series.data[0].x;
                    for (var j=1, len=series.data.length; j<len; j++) {
                        if (prev > series.data[j].x) {
                            isSorted = false;
                            break;
                        }
                    }
                });

                return isSorted;
            };

            jasmine.addMatchers({
                toBeNormalizedDataPoint: function () {
                    return function (actual, expected) {

                        var notText = this.isNot ? ' not' : '';
                        var message = function () {
                            return 'Expected ' + actual + notText + ' to be normalized data point and is not';
                        };

                        return {
                            pass: actual.hasOwnProperty('x') && actual.hasOwnProperty('y'),
                            message: message()
                        };

                    };
                },

                toBeNormalizedSeries: function () {
                    return {
                        compare: function (actual, expected) {
                            var notText = this.isNot ? ' not' : '';
                            var missing = [];

                            if(!actual.hasOwnProperty('name')) missing.push('series name (name)');
                            if(!actual.hasOwnProperty('data')) missing.push('series data (data)');
                            if(!_.every(actual.data, function (d) { return d.hasOwnProperty('x') && d.hasOwnProperty('y'); })) missing.push('not all data points have x & y fields');

                            message = function () { return 'Expected object' + notText + ' to be normalize series and is missing: ' + missing.join(', '); };

                            return {
                                pass: !missing.length,
                                message: message()
                            };
                        }
                    };
                },

                toBeSorted: function () {
                    return {
                        compare: function (actual, expect) {
                            return {
                                pass: isSeriesSorted(actual),
                                message: 'expected series data to be sorted',
                            };
                        },

                        negativeCompare: function (actual) {
                            return {
                                pass: !isSeriesSorted(actual),
                                message: 'expected series data NOT to be soreted'
                            };
                        }
                    };
                }
            });
        });

        it('should sort data if its not categorized ', function () {
            var data = [
                { x: 3, y: 5 },
                { x: 1, y: 5 },
                { x: 2, y: 5 }
            ];

            var series = _.nw.normalizeSeries(data);
            expect(series).toBeSorted();
        });

        it('should not sort data if its categorized', function () {
            var data = [ 5,6,7];
            var series = _.nw.normalizeSeries(data, ['d', 'x', 'a']);
            expect(series).not.toBeSorted();
        });

        it('should normalize a single array of values into an array with one series object', function () {
            var data = [1,2,3,4];
            var series = _.nw.normalizeSeries(data);

            expect(series.length).toBe(1);
            expect(series[0]).toBeNormalizedSeries();
        });

        it('should normalize a single array of x&y objects into an array with one normalized series', function () {
            var data = [
                { x: 'a', y:1 },
                { x: 'b', y:2 },
                { x: 'c', y:3 },
            ];
            var series = _.nw.normalizeSeries(data);

            expect(series.length).toBe(1);
            expect(series[0]).toBeNormalizedSeries();
        });

        it('should normalize an array of unnormalized series objects into an array of normalized series objects', function () {
            var data = [
                { name: 's1', data: [1,2,3,4] },
                { name: 's2', data: [1,2,3,4] },
                { name: 's3', data: [1,2,3,4] }
            ];
            var series = _.nw.normalizeSeries(data);

            expect(series.length).toBe(3);
            expect(series[0]).toBeNormalizedSeries();
            expect(series[1]).toBeNormalizedSeries();
            expect(series[2]).toBeNormalizedSeries();
        });

        it('should normalize an array of value arrays into an array of normalized series objects', function () {
            var data = [
                [1,2,3,4],
                [1,2,3,4],
                [1,2,3,4]
            ];
            var series = _.nw.normalizeSeries(data);

            expect(series.length).toBe(3);
            expect(series[0]).toBeNormalizedSeries();
            expect(series[1]).toBeNormalizedSeries();
            expect(series[2]).toBeNormalizedSeries();
        });

        it('should normalize missing Y points as null', function () {
            var data = [
                { x: 'a', y: 1 },
                { x: 'b', y: null },
                { x: 'c' },
            ];

            var series = _.nw.normalizeSeries(data);
            var s1 = series[0];

            expect(s1.data[0].y).toBe(1);
            expect(s1.data[1].y).toBe(null);
            expect(s1.data[2].y).toBe(null);
        });

        it('should normalize null array values as y=null', function () {
            var data = [1,2,null,undefined,3];
            var series = _.nw.normalizeSeries(data);
            var s1 = series[0];
            expect(s1.data[0].y).toBe(1);
            expect(s1.data[1].y).toBe(2);
            expect(s1.data[2].y).toBe(null);
            expect(s1.data[3].y).toBe(null);
            expect(s1.data[4].y).toBe(3);
        });

        it('should return same instance of data if is correctly formatted (no copy)', function () {
            var data = [
                {
                    name: 'Series A',
                    data: [
                        {x: 0, y: 1},
                        {x: 1, y: 2},
                        {x: 2, y: 3}
                    ]
                }
            ];

            var series = _.nw.normalizeSeries(data);

            expect(series).toBe(data);
        });

        it('should insert the instance of data into a series object if data is in correct format', function () {
            var data = [
                {x: 0, y: 1},
                {x: 1, y: 2},
                {x: 2, y: 3}
            ];

            var series = _.nw.normalizeSeries(data);

            expect(series[0].data).toBe(data);
        });


        describe('when passing a categories array', function () {
            it('should use the categories array for normalized x values', function () {
                var data = [1,2,3,4];
                var cats = ['a', 'b', 'c', 'd'];

                var series = _.nw.normalizeSeries(data, cats);
                var s1 = series[0];

                expect(s1.data[0].x).toBe('a');
                expect(s1.data[1].x).toBe('b');
                expect(s1.data[2].x).toBe('c');
                expect(s1.data[3].x).toBe('d');

                expect(s1.data[0].y).toBe(1);
                expect(s1.data[1].y).toBe(2);
                expect(s1.data[2].y).toBe(3);
                expect(s1.data[3].y).toBe(4);
            });

            it('should treat null x categories as null', function () {
                var data = [1,2,3,4];
                var cats = ['a', 'b', null, 'd'];

                var series = _.nw.normalizeSeries(data, cats);
                var s1 = series[0];

                expect(s1.data[2].x).toBeNull();

            });


            it('individual point X values should take presendence over the categories array (we may need to change this assumption later based on usage??)', function () {
                var data = [
                    { x: 'x', y: 1 },
                    { x: 'y', y: 2 },
                    { x: 'z', y: 3 }
                ];
                var cats = ['a', 'b', 'c'];

                var series = _.nw.normalizeSeries(data, cats);
                var s1 = series[0];

                expect(s1.data[0].x).toBe('x');
                expect(s1.data[1].x).toBe('y');
                expect(s1.data[2].x).toBe('z');

                expect(s1.data[0].y).toBe(1);
                expect(s1.data[1].y).toBe(2);
                expect(s1.data[2].y).toBe(3);
            });
        });
    });

    describe('stacked layout', function () {
        it('should handle simple stacked data', function () {
            var data = [{name: 'a', data: [{x: 0, y: 1}, {x: 1, y: 2}]}, {name: 'b', data: [{x: 0, y: 4}, {x: 1, y: 5}]}];
            var expected = [
                { name: 'a', data: [{x: 0, y: 1, y0: 0}, {x: 1, y: 2, y0: 0}] },
                { name: 'b', data: [{x: 0, y: 4, y0: 1}, {x: 1, y: 5, y0: 2}] }
            ];

            var res = _.nw.stackLayout()(data);

            expect(res).toEqual(expected);
        });

        it('should handle stacked categorical data', function () {
            var data = [
                { name: 'app1', data: [{x:'10.10', y: 5}] },
                { name: 'app2', data: [{x:'10.10', y: 7}] },
                { name: 'app3', data: [{x:'10.11', y: 9}] },
                { name: 'app4', data: [{x:'10.11', y: 3}] }
            ];

            var expected = [
                { name: 'app1', data: [{x:'10.10', y: 5, y0: 0}] },
                { name: 'app2', data: [{x:'10.10', y: 7, y0: 5}] },
                { name: 'app3', data: [{x:'10.11', y: 9, y0: 0}] },
                { name: 'app4', data: [{x:'10.11', y: 3, y0: 9}] }
            ];

            var res = _.nw.stackLayout()(data);
            expect(res).toEqual(expected);
        });

        it('should handle complex categorical data', function () {
            var data = [
                { "data": [{ "x": "10.0.17.22", "y": 1, } ], "name": "/monitoring/model-lua" },
                { "data": [{ "x": "10.0.17.22", "y": 4, } ], "name": "/jaimedp/pda" },
                { "data": [{ "x": "10.0.17.22", "y": 1, } ], "name": "/monitoring/model-julia" },
                { "data": [{ "x": "10.0.17.22", "y": 146, } ], "name": "Free" }
            ];

            var expected = [
                { "data": [{ "x": "10.0.17.22", "y": 1, y0: 0 } ], "name": "/monitoring/model-lua" },
                { "data": [{ "x": "10.0.17.22", "y": 4, y0: 1 } ], "name": "/jaimedp/pda" },
                { "data": [{ "x": "10.0.17.22", "y": 1, y0: 5 } ], "name": "/monitoring/model-julia" },
                { "data": [{ "x": "10.0.17.22", "y": 146, y0: 6 } ], "name": "Free" }
            ];

            var res = _.nw.stackLayout()(data);
            expect(res).toEqual(expected);

        });
    });

    describe('materialize', function () {
        var mat = _.nw.materialize;
        describe('when passed an array', function () {
            it('should return an array', function () {
                expect(mat([1,2,3])).toEqual([1,2,3]);
            });
        });

        describe('when pass an number', function () {
            it('should return the number', function () {
                expect(mat(5)).toBe(5);
            });
        });

        describe('when passed string', function () {
            it('should return a string', function () {
                expect(mat('hello')).toBe('hello');
            });
        });

        describe('when passed an object', function () {
            var res;
            var passCtx;
            var expectedContext = {};
            var input;
            beforeEach(function () {
                input = {
                    a: 1,
                    b: 'hello',
                    c: function () { return 2; },
                    x: function () { return 'keep'; },
                    d: {
                        a: 11,
                        b: 'hello world',
                        c: function () { return true; },
                        d: function () { passCtx = this; return 'do'; },
                        x: function () { return 'keep'; },
                        zzz: function () { return 'keep'; },
                        other: function (d) {
                            return d.x;
                        }
                    }
                };


                res = mat(input, expectedContext, {
                    skip: ['x', 'd.x'],
                    skipMatch: /zzz/
                });
            });

            it('should materialize all props that are functions', function () {
                expect(res.c).toBe(2);
            });

            it('should materialize nested objects', function () {
                expect(res.d.c).toBe(true);
            });

            it('should not change non function props', function () {
                expect(res.d.b).toBe('hello world');
                expect(res.d.a).toBe(11);
            });

            it('should pass the correct context to the functions', function () {
                expect(passCtx).toBe(expectedContext);
            });

            it('should skip the skip list', function () {
                expect(res.x).toEqual(input.x);
                expect(res.d.x).toEqual(input.d.x);
            });

            it('should skip the skipMatch', function () {
                expect(res.d.zzz).toEqual(input.d.zzz);
            });

            it('should skip functions that expect parameters', function () {
                expect(res.d.other).toEqual(input.d.other);
            });
        });
    });

    describe('partial', function () {
        it('should return a partially binded function', function () {
            var fn = function (a, b) { return a + b; };
            var a = _.nw.partial(fn, 2);
            expect(a(3)).toBe(5)
        });
    });

    describe('partialRight', function () {
        it('should return a partially binded function with params at the end', function () {
            var fn = function (a, b) { return a - b; };
            var a = _.nw.partialRight(fn, 2);
            expect(a(3)).toBe(1)
        });
    });

    describe('isDate', function () {
        it('should return true for date objects', function () {
            expect(_.nw.isDate(new Date())).toBe(true);
        });

        it('should return false for other objects', function () {
            expect(_.nw.isDate({})).toBe(false);
        });
    });

    describe('isNumber', function () {
        it('should return true for date objects', function () {
            expect(_.nw.isNumber(5)).toBe(true);
        });

        it('should return false for other objects', function () {
            expect(_.nw.isNumber('5')).toBe(false);
            expect(_.nw.isNumber('hello')).toBe(false);
            expect(_.nw.isNumber({})).toBe(false);
            expect(_.nw.isNumber(new Date())).toBe(false);
            expect(_.nw.isNumber(null)).toBe(false);
        });
    });

    describe('range', function () {
        it('should create range with default step 1', function () {
            expect(_.nw.range(1,5)).toEqual([1,2,3,4])
        });

        it('if only one param it should be the size of the range [0...n]', function () {
            expect(_.nw.range(5)).toEqual([0,1,2,3,4])
        });

        it('should accept a step', function () {
            expect(_.nw.range(1, 5, 2)).toEqual([1,3])
        });

        it('should get emtpy range if 0', function () {
            expect(_.nw.range(0)).toEqual([]);
        });

        it('should accept negative ranges', function () {
            expect(_.nw.range(-4)).toEqual([0, -1, -2, -3]);
            expect(_.nw.range(0, -4, -1)).toEqual([0, -1, -2, -3]);
        });

        it('should accept fractional ranges', function () {
            expect(_.nw.range(0, 2, .5)).toEqual([0, .5, 1, 1.5]);
        })
    });

    describe('uniq', function () {
        it('should return empty array if null of not array', function () {
            expect(_.nw.uniq(5)).toEqual([]);
            expect(_.nw.uniq(null)).toEqual([]);
            expect(_.nw.uniq([])).toEqual([]);
        });

        it('should return uniq values', function () {
            // expect(_.nw.uniq([1,2,3,4])).toEqual([1,2,3,4]);
            expect(_.nw.uniq([1,2,3,4,4])).toEqual([1,2,3,4]);
            expect(_.nw.uniq([1,2,3,3,4])).toEqual([1,2,3,4]);
            expect(_.nw.uniq([1,1, 2, 2 ,3, 3, 4, 4])).toEqual([1,2,3,4]);
        })
    });

    describe('flatten', function () {
        it('should flatten inner arrays', function () {
            var a = [[1,2],3, [[[4]]]];
            expect(_.nw.flatten(a)).toEqual([1,2,3,4]);
        });

        it('should return empty array if empty array is passed in', function () {
            expect(_.nw.flatten([])).toEqual([]);
        });

        it('should return empty array if empty null is passed in', function () {
            expect(_.nw.flatten()).toEqual([]);
        });
    });

    describe('compact', function () {
        it('should remove falsy elements', function () {
            expect(_.nw.compact([0, 1, 2, undefined, null, NaN, '', 3, undefined])).toEqual([1,2,3]);
        })
    });

    describe('intersection', function () {
        it('should return the common elements between two arrays', function () {
            var a = [1,2,3,4,5];
            var b = [2,4,6,8,10,12];
            expect(_.nw.intersection(a, b)).toEqual([2,4]);
        });

        it('should preseve the order of the first array', function () {
            var a = [5,4,2,6,8];
            var b = [2,5,8];

            var res = _.nw.intersection(a, b);
            expect(res).toEqual([5,2,8]);
        });

        it('should return empty array if any array is null or empty', function () {
            expect(_.nw.intersection(null, [1,2,3])).toEqual([]);
            expect(_.nw.intersection([1,2,3], null)).toEqual([]);
            expect(_.nw.intersection([1,2,3], [])).toEqual([]);
            expect(_.nw.intersection([], [1,2,3])).toEqual([]);
        });
    });

    describe('merge', function () {
        it('should merge all props in both objects', function () {
            var a = { a: 1, b: 2 };
            var b = { c: 3, x: 4 };

            expect(_.nw.merge(a, b)).toEqual({ a: 1, b: 2, c: 3, x: 4 });
        });

        it('should override common non mergable props with the second object', function () {
            var a = { a: 1, b: 2 };
            var b = { a: 3, x: 4 };

            expect(_.nw.merge(a, b)).toEqual({ a: 3, b: 2, x: 4 });
        });

        it('should deep merge simple mergable object', function () {
            var a = { a: { x: 1 }, b: 2 };
            var b = { a: { y: 2 }, c: 3 };
            expect(_.nw.merge(a, b)).toEqual({ a: { x: 1, y: 2 }, b: 2, c: 3 });
        });

        it('should not deep merge arrays (replace)', function () {
            var a = { a: { x: [1,2,3] }, b: 2 };
            var b = { a: { x: [4,5,6] }, c: 4 };

            expect(_.nw.merge(a, b)).toEqual({
                a: { x: b.a.x },
                b: 2, c: 4
            });
        });

        it('should skip undefined props from source object that exist in target', function () {
            var a = { a: 1, b: 2 };
            var b = { b: undefined };
            expect(_.nw.merge(a, b)).toEqual({ a: 1, b: 2 });
        });

        it('should merge array of objects', function () {
            var object = { a: [{ 'b': 2 }, { 'd': 4 }] };
            var other = { a: [{ 'c': 3 }, { 'e': 5 }]};

            expect(_.nw.merge(object, other)).toEqual({ 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] });
        });

        it('for both value types just pass the second one back', function () {
            expect(_.nw.merge(5, 6)).toEqual(6);
        });

        it('should mutate first object', function () {
            var a = {};
            var b = { x: 1, y: 2 };
            _.nw.merge(a, b);
            expect(a).toEqual({ x: 1, y: 2 });
        });

        it('should merge any number of objects > 2', function () {
            var a = { x: 1 };
            var b = { y: 2 };
            var c = { z: 3 };
            var d = { zz: 4 };

            expect(_.nw.merge(a, b, c, d)).toEqual({ x: 1, y: 2, z: 3, zz: 4 });
        });

        it('should return the destination if target is undefined', function () {
            var a = { x: 1 };
            expect(_.nw.merge(a, undefined)).toEqual(a);
        });

        it('should merge boolean false values from target', function () {
            var a = { x: true };
            var b = { x: false };
            expect(_.nw.merge(a, b)).toEqual({ x: false });
        });

        it('should merge boolean false values from src', function () {
            var a = { x: false };
            var b = { x: 5 };
            expect(_.nw.merge(a, b)).toEqual({ x: 5 });
        });

        it('should deep merge objects that are not in target', function () {
            var a = { chart: { padding: { top: undefined, left: undefined }}};
            var b = { chart: { padding: { right: 15 }}};

            var res = _.nw.merge({}, a, b);
            expect(a.chart.padding.right).toBe(undefined);
        });


    });
});
