describe('Linear axis scale', function () {


    var axis;
    var data;

    var defaults = {
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
        return new nw.axes.LinearScale(data, $.extend(true, {}, defaults, options));
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
        opt = {
            xAxis: {
                tickValues: [2,4,6]
            }
        };

        var axisScale = createAxis(opt);
        axisScale.scale();
        expect(axisScale.axis().tickValues()).toEqual([2,4,6]);
    });

    it('should reduce the number of ticks if they dont fit', function () {
        ax = createAxis({ chart: {plotWidth: 500}});
        ax.scale();
        expect(ax.axis().ticks()[0]).toBe(10);


        ax = createAxis({ chart: {plotWidth: 150}});
        ax.scale();
        expect(ax.axis().ticks()[0]).toBe(4);

        ax = createAxis({ chart: {plotWidth: 40}});
        ax.scale();
        expect(ax.axis().ticks()[0]).toBe(2);
    });
});
