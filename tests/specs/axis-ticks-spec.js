describe('contour-utils niceMinMax', function () {


    it('should use increment of 2 when min=0, max=10, ticks=5', function () {
        var nice = _.nw.niceMinMax(0, 10, 5);

        expect(nice.min).toBe(0);
        expect(nice.max).toBe(10);
        expect(nice.tickValues).toEqual([0,2,4,6,8,10]);
    });

    it('should handle negative min & positive max', function () {
        var nice = _.nw.niceMinMax(-3, 3, 6);

        expect(nice.min).toBe(-3);
        expect(nice.max).toBe(3);
        expect(nice.tickValues).toEqual([-3, -2, -1, 0, 1, 2, 3]);
    });


    it('should handle negative min & positive max decimal values', function () {
        var nice = _.nw.niceMinMax(-0.3, 0.3, 6);

        expect(nice.min).toBe(-0.3);
        expect(nice.max).toBe(0.3);
        expect(nice.tickValues).toEqual([-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3]);
    });

    it('should handle |max| - |min| < 1 ', function () {
        var nice = _.nw.niceMinMax(-10, 10.1, 5);

        expect(nice.min).toBe(-10);
        expect(nice.max).toBe(15);
        expect(nice.tickValues).toEqual([-10, -5, 0, 5, 10, 15]);
    });

    it('should handle negative min orders of mag bigger than positive max values', function () {
        var nice = _.nw.niceMinMax(-12.1, 0.1, 5);

        expect(nice.min).toBe(-12.1);
        expect(nice.max).toBe(2.9);
        expect(nice.tickValues).toEqual([-12.1, -9.1, -6.1, -3.1, -0.1, 2.9]);
    });


    it('should handle negative min many orders of mag bigger than positive max values', function () {
        var nice = _.nw.niceMinMax(-100000, 0.1, 5);

        expect(nice.min).toBe(-100000);
        expect(nice.max).toBe(50000);
        expect(nice.tickValues).toEqual([-100000, -70000, -40000, -10000, 20000, 50000]);
    });

    it('should handle decimal values all positive', function () {
        var nice = _.nw.niceMinMax(0.4, 0.8, 5);

        expect(nice.min).toBe(0.4);
        expect(nice.max).toBe(0.9);
        expect(nice.tickValues).toEqual([0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
    });

    describe('when min > max', function () {
        it('should return empty ticks array', function () {
            var nice = _.nw.niceMinMax(2, 1, 5);
            expect(nice.tickValues).toEqual([]);
        });

        it('shold return max = min', function () {
            var nice = _.nw.niceMinMax(2, 1, 5);
            expect(nice.min).toBe(2);
            expect(nice.max).toBe(2);
        });
    });

    describe('when min === max', function () {
        // we need to define the behavior here...
    });
});
