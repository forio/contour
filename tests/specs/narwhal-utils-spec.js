describe('dateDiff', function () {
    it('should return the difference in days of two dates', function () {
        var d1 = new Date('2010-01-01 10:00');
        var d2 = new Date('2010-01-02 10:00');

        expect(_.nw.dateDiff(d2, d1)).toBe(1);
    });
});

describe('roundToNearest', function () {
    it('should round the given number to the neares specified multiple', function () {
        expect(_.nw.roundToNearest(7, 14)).toBe(14);
        expect(_.nw.roundToNearest(7, 10)).toBe(10);
    });
});

describe('normalizeSeries', function () {

    beforeEach(function () {
        this.addMatchers({
            toBeNormalizedDataPoint: function () {
                var actual = this.actual;
                var notText = this.isNot ? ' not' : '';
                this.message = function () {
                    return 'Expected ' + actual + notText + ' to be normalized data point and is not';
                };

                return actual.hasOwnProperty('x') && actual.hasOwnProperty('y');
            },

            toBeNormalizedSeries: function () {
                var actual = this.actual;
                var notText = this.isNot ? ' not' : '';
                var missing = [];

                if(!actual.hasOwnProperty('name')) missing.push('series name (name)');
                if(!actual.hasOwnProperty('data')) missing.push('series data (data)');
                if(!_.all(actual.data, function (d) { return d.hasOwnProperty('x') && d.hasOwnProperty('y'); })) missing.push('not all data points have x & y fields');

                this.message = function () { return 'Expected object' + notText + ' to be normalize series and is missing: ' + missing.join(', '); };

                return !missing.length;
            }
        });
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
