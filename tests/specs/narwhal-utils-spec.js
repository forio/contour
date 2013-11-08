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
