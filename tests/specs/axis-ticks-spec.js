import * as nwt from '../../src/scripts/utils/contour-utils';

describe('contour-utils niceMinMax', function () {
    it('should use increment of 2 when min=0, max=10, ticks=5', function () {
        var nice = nwt.niceMinMax(0, 10, 5);

        expect(nice.min).toBe(0);
        expect(nice.max).toBe(10);
        expect(nice.tickValues).toEqual([0,2,4,6,8,10]);
    });

    it('should handle negative min & positive max', function () {
        var nice = nwt.niceMinMax(-3, 3, 6);

        expect(nice.min).toBe(-3);
        expect(nice.max).toBe(3);
        expect(nice.tickValues).toEqual([-3, -2, -1, 0, 1, 2, 3]);
    });


    it('should handle negative min & positive max decimal values', function () {
        var nice = nwt.niceMinMax(-0.3, 0.3, 6);

        expect(nice.min).toBe(-0.3);
        expect(nice.max).toBe(0.3);
        expect(nice.tickValues).toEqual([-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3]);
    });

    it('should handle |max| - |min| < 1 ', function () {
        var nice = nwt.niceMinMax(-10, 10.1, 5);

        expect(nice.min).toBe(-10);
        expect(nice.max).toBe(15);
        expect(nice.tickValues).toEqual([-10, -5, 0, 5, 10, 15]);
    });

    it('should handle negative min orders of mag bigger than positive max values', function () {
        var nice = nwt.niceMinMax(-12.1, 0.1, 5);

        expect(nice.min).toBe(-12.1);
        expect(nice.max).toBe(2.9);
        expect(nice.tickValues).toEqual([-12.1, -9.1, -6.1, -3.1, -0.1, 2.9]);
    });


    it('should handle negative min many orders of mag bigger than positive max values', function () {
        var nice = nwt.niceMinMax(-100000, 0.1, 5);

        expect(nice.min).toBe(-100000);
        expect(nice.max).toBe(50000);
        expect(nice.tickValues).toEqual([-100000, -70000, -40000, -10000, 20000, 50000]);
    });

    it('should handle decimal values all positive', function () {
        var nice = nwt.niceMinMax(0.4, 0.8, 5);

        expect(nice.min).toBe(0.4);
        expect(nice.max).toBe(0.9);
        expect(nice.tickValues).toEqual([0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
    });

    it('should handle small values', function () {
        var nice = nwt.niceMinMax(0, 0.2, 5);

        expect(nice.min).toBe(0);
        expect(nice.max).toBe(0.2);
        expect(nice.tickValues).toEqual([0, 0.04, 0.08, 0.12, 0.16, 0.2]);
    });

    it('should handle really small values', function () {
        var nice = nwt.niceMinMax(0, 0.01, 5);

        expect(nice.min).toBe(0);
        expect(nice.max).toBe(0.01);
        expect(nice.tickValues).toEqual([0, 0.002, 0.004, 0.006, 0.008, 0.01]);
    });

    it('should handle really really small values', function () {
        var nice = nwt.niceMinMax(0, 5e-4, 5);

        expect(nice.min).toBe(0);
        expect(nice.max).toBe(5e-4);
        expect(nice.tickValues).toEqual([0, 1e-4, 2e-4, 3e-4, 4e-4, 5e-4]);
    });

    it('should return a slightly different number of round ticks if possible', function () {
        var nice = nwt.niceMinMax(0, 3, 5);

        expect(nice.min).toBe(0);
        expect(nice.max).toBe(3);
        expect(nice.tickValues).toEqual([0, 1, 2, 3]);
    });

    describe('when zeroAnchor is false', function () {
        it('should not anchor at zero', function () {
            var nice = nwt.niceMinMax(1, 4, 5, false);

            expect(nice.min).toBe(1);
            expect(nice.max).toBe(4);
            expect(nice.tickValues).toEqual([1, 2, 3, 4]);
        });
    });

    describe('when zeroAnchor is true', function () {
        it('should anchor at zero', function () {
            var nice = nwt.niceMinMax(1, 3, 5, true);

            expect(nice.min).toBe(0);
            expect(nice.max).toBe(3);
            expect(nice.tickValues).toEqual([0, 1, 2, 3]);
        });
    });

    describe('when min > max', function () {
        it('should return empty ticks array', function () {
            var nice = nwt.niceMinMax(2, 1, 5);
            expect(nice.tickValues).toEqual([]);
        });

        it('shold return max = min', function () {
            var nice = nwt.niceMinMax(2, 1, 5);
            expect(nice.min).toBe(2);
            expect(nice.max).toBe(2);
        });
    });

    describe('when min === max', function () {
        // we need to define the behavior here...
    });

    describe('when min < max < 0', function () {
        it('should include zero by default', function () {
            var nice = nwt.niceMinMax(-5, -4, 5);
            expect(nice.max).toBe(0);
        });

        it('should have the min number as the min of the domain', function () {
            var nice = nwt.niceMinMax(-5, -4, 5);
            expect(nice.min).toBe(-5);
        });
    });
});
