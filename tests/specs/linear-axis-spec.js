import * as nwt from '../../src/scripts/utils/contour-utils';
import LinearScale from '../../src/scripts/core/axis/linear-scale-axis';

describe('Linear axis scale', function () {
    let data;
    const defaults = {
        chart: {
            plotWidth: 500,
            rotatedFrame: false
        },
        xAxis: {
            labels: {
            }
        }
    };

    function createAxis(options) {
        return new LinearScale(data, nwt.merge({}, defaults, options));
    }

    beforeEach(function () {
        data = [100, 200, 300];
    });

    it('should use max if defined', function () {
        var opt = {
            xAxis: {
                max: 500
            }
        };

        expect(createAxis(opt).scale().domain()).toEqual([100, 500]);
    });

    it('should use min if defined', function () {
        var opt = {
            xAxis: {
                min: 0
            }
        };

        expect(createAxis(opt).scale().domain()).toEqual([0, 300]);
    });

    it('should use the data domain if no min/max defined', function () {
        expect(createAxis().scale().domain()).toEqual([100, 300]);
    });

    it('should use domain min/max if min/max options are not possible (ie min > max)', function () {
        var opt = {
            xAxis: {
                min: 10,
                max: 1
            }
        };

        expect(createAxis(opt).scale().domain()).toEqual([100, 300]);

    });

    it('should use not use nicing if min || max are defined', function () {
        var opt = {
            xAxis: {
                min: 3,
                max: 297
            }
        };

        expect(createAxis(opt).scale().domain()).toEqual([3, 297]);
    });

    it('should use tickValues if defined', function () {
        const opt = {
            xAxis: {
                tickValues: [2,4,6]
            }
        };

        var axisScale = createAxis(opt);
        axisScale.scale();
        expect(axisScale.axis().tickValues()).toEqual([2,4,6]);
    });

    // THIS TEST CANNOT RUN WITH JSDOM... WE NEED TO FIGURE OUT A DIFFERENT
    // WAY TO TEST IT WITHOUT THE NEED FOR AN ACTUAL LAYOUT ENGINE
    xit('should reduce the number of ticks if they dont fit', function () {
        let ax = createAxis({ chart: {plotWidth: 500}});
        ax.scale();
        expect(ax.axis().ticks()[0]).toBe(10);


        ax = createAxis({ chart: {plotWidth: 150}});
        ax.scale();
        expect(ax.axis().ticks()[0]).toBe(4);

        ax = createAxis({ chart: {plotWidth: 40}});
        ax.scale();
        expect(ax.axis().ticks()[0]).toBe(2);
    });

    describe('update', function () {
        it('should accept new options values whe updating scale', function () {
            const ax = createAxis({ xAxis: { min: 5 }});
            ax.scale();
            expect(ax.scale().domain()).toEqual([5, 300]);

            ax.update([100,300], data, { chart: {}, xAxis: { min: 3 }});
            expect(ax.scale().domain()).toEqual([3, 300]);
        });
    });
});
