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

});
