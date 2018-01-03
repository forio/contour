import $ from 'jquery';
import Contour from '../../src/scripts/core/contour';
import '../../src/scripts/core/cartesian';
import '../../src/scripts/visualizations/null';
import '../../src/scripts/visualizations/column';

describe('Column chart', function () {

    var el, $el;
    var data = [1,2,3];
    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createinstance(options) {
        options = Object.assign({ el: el, chart: { animations: false } }, options);
        var instance = new Contour(options).cartesian();
        return instance;
    }

    describe('render', function () {
        it('should create one rect per data point', function () {
            createinstance().column(data).render();
            var rects = $el.find('rect.column');
            expect(rects.length).toBe(3);
        });

        it('should add the column class to each column', function () {
            createinstance().column(data).render();
            var rects = $el.find('rect.column');

            expect(rects.filter('.column').length).toBe(3);
        });

        it('should set the hight of each column to the corresponding yScale value', function () {
            var nw = createinstance().column(data).render();
            var rects = $el.find('rect.column');
            var y = function (d) { return nw.yScale(0) - Math.round(nw.yScale(d)); };

            expect(+rects.eq(0).attr('height')).toBe(y(data[0]));
            expect(+rects.eq(1).attr('height')).toBe(y(data[1]));
            expect(+rects.eq(2).attr('height')).toBe(y(data[2]));
        });

        describe('stacked', function () {
            it('should move the columns by \'offset\' if specified', function () {
                var offset = 50;
                var nw = createinstance({
                    chart: { width: 401 },
                    column: { offset: offset , stacked: true }
                }).column(data).render();

                var rects = $el.find('rect.column');
                var x1 = +(nw.xScale(0) + offset + 0.5).toFixed(2);

                expect(+rects.eq(0).attr('x')).toBe(x1);
            });

            it('should call the offset function with instance instance context if specified', function () {
                var ctx;
                var offset = function () { ctx = this; return 50; };
                var nw = createinstance({
                    column: { offset: offset , stacked: true }
                }).column(data).render();

                expect(ctx).toBe(nw);
            });

            it('should user columnWidth value to get the width for each column', function () {
                createinstance({
                    column: { columnWidth: 1.5 , stacked: true }
                }).column(data).render();

                var rects = $el.find('rect.column');
                expect(+rects.eq(0).attr('width')).toBe(1.5);
                expect(+rects.eq(1).attr('width')).toBe(1.5);
                expect(+rects.eq(2).attr('width')).toBe(1.5);
            });

            it('should user columnWidth function to get the width for each column', function () {
                createinstance({
                    column: { columnWidth: function () { return 1.5; }, stacked: true }
                }).column(data).render();

                var rects = $el.find('rect.column');
                expect(+rects.eq(0).attr('width')).toBe(1.5);
                expect(+rects.eq(1).attr('width')).toBe(1.5);
                expect(+rects.eq(2).attr('width')).toBe(1.5);
            });

        });

        describe('grouped', function () {
            it('should move the columns by \'offset\' if specified', function () {
                var offset = 50;
                var nw = createinstance({
                    column: { offset: offset, stacked: false }
                }).column(data).render();

                var rects = $el.find('rect.column');
                var x1 = +(nw.xScale(0) + offset + 1).toFixed(1);

                expect(+rects.eq(0).attr('x')).toBe(x1);
            });

            it('should user columnWidth function to get the width for each column in the group', function () {
                createinstance({
                    column: { padding: 1, columnWidth: function () { return 3; }, stacked: false }
                }).column([{data: [1,2,3]}, {data: [4,5,6]}]).render();

                // each group has #series columns, in this case two series, so each group has 2 columns
                // the width of each column should be rangeBand / 2 - padding
                // (0.5 to account for sub pixel offset introduced in visualizations to prevent fuzzy edges)
                var w = 3/2 - 1 + 0.5;

                var rects = $el.find('rect.column');
                expect(+rects.eq(0).attr('width')).toBe(w);
                expect(+rects.eq(1).attr('width')).toBe(w);
                expect(+rects.eq(2).attr('width')).toBe(w);
            });
        });

    });

});
