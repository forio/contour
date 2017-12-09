import $ from 'jquery';
import d3 from 'd3';
import Contour from '../../src/scripts/core/contour';
import '../../src/scripts/core/cartesian';
import '../../src/scripts/visualizations/null';

describe('time Axis', function () {
    var $el, el;
    var instance;

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createinstance(options) {
        options = Object.assign({ el: el }, options);
        instance = new Contour(options).cartesian();
        return instance;
    }

    it('should show all tick labels by ', function () {
        instance = createinstance({ xAxis: { firstAndLast: undefined }})
            .nullVis([
                { x: new Date('10/11/2013'), y: 10 },
                { x: new Date('10/12/2013'), y: 20 },
                { x: new Date('10/13/2013'), y: 30 }
            ])
            .render();

        var xLabels = $(instance.svg.selectAll('.x.axis .tick text')[0]);
        expect(xLabels.length).toBe(3);
    });


    it('should only show first and last tick labels by default', function () {
        instance = createinstance({ xAxis: { firstAndLast: true }})
            .nullVis([
                { x: new Date('10/11/2013'), y: 10 },
                { x: new Date('10/12/2013'), y: 20 },
                { x: new Date('10/13/2013'), y: 30 }
            ])
            .render();

        var xLabels = instance.svg.selectAll('.x.axis .tick text')[0];
        expect(xLabels.length).toBe(2);
    });

    it('should show only passed in tickValues', function () {
        var tickVals = [new Date('10/12/2013')];
        instance = createinstance({ xAxis: { tickValues: tickVals }})
            .nullVis([
                { x: new Date('10/11/2013'), y: 10 },
                { x: new Date('10/12/2013'), y: 20 },
                { x: new Date('10/13/2013'), y: 30 }
            ])
            .render();

        var xLabels = instance.svg.selectAll('.x.axis .tick text')[0];
        expect(xLabels.length).toBe(1);
        expect(instance._xAxis.tickValues()).toEqual(tickVals);
    });

    it('should set text-anchor:left to first label and text-anchor:end to last label only when firstAndLast is set to true', function () {
        instance = createinstance({ xAxis: { firstAndLast: true }})
            .nullVis([
                { x: new Date('10/11/2013'), y: 10 },
                { x: new Date('10/12/2013'), y: 20 },
                { x: new Date('10/13/2013'), y: 30 }
            ])
            .render();

        var xLabels = $(instance.svg.selectAll('.x.axis .tick text')[0]);
        expect(xLabels.eq(0).css('text-anchor')).toBe('start');
        expect(xLabels.eq(1).css('text-anchor')).toBe('end');
    });

    it('should set text-anchor:middle on first and last labels only when firstAndLast is set to false', function () {
        instance = createinstance({ xAxis: { firstAndLast: false }})
            .nullVis([
                { x: new Date('10/11/2013'), y: 10 },
                { x: new Date('10/12/2013'), y: 20 },
                { x: new Date('10/13/2013'), y: 30 }
            ])
            .render();

        var xLabels = $(instance.svg.selectAll('.x.axis .tick text')[0]);
        expect(xLabels.eq(0).css('text-anchor')).toBe('middle');
        expect(xLabels.eq(2).css('text-anchor')).toBe('middle');
    });

    it('should top the number of ticks to options.xAxis.maxTicks if pressent', function () {
        instance = createinstance({ xAxis: { firstAndLast: false, maxTicks: 2 }})
            .nullVis([
                { x: new Date('10/11/2013'), y: 10 },
                { x: new Date('10/12/2013'), y: 20 },
                { x: new Date('10/13/2013'), y: 30 }
            ])
            .render();

        var xLabels = $(instance.svg.selectAll('.x.axis .tick text')[0]);
        expect(xLabels.length).toBe(2);
    });

    it('should show date only format when x values span more than 24 hrs. ', function () {
        var data = [
            { x: new Date('10/11/2013'), y: 10 },
            { x: new Date('10/12/2013'), y: 20 },
            { x: new Date('10/13/2013'), y: 30 }
        ];
        instance = createinstance()
            .nullVis(data)
            .render();

        var xLabels = $(instance.svg.selectAll('.x.axis .tick text')[0]);
        var formatter = d3.time.format('%d %b'); // ie. 11 Oct
        expect(xLabels.length).toBe(3);
        expect(xLabels.eq(0).text()).toBe(formatter(data[0].x));
        expect(xLabels.eq(1).text()).toBe(formatter(data[1].x));
        expect(xLabels.eq(2).text()).toBe(formatter(data[2].x));
    });

    it('should print hrs, when xDomain is all in the same day', function () {
        instance = createinstance()
            .nullVis([
                { x: new Date('10/11/2013 10:00'), y: 10 },
                { x: new Date('10/11/2013 11:00'), y: 20 },
                { x: new Date('10/11/2013 12:00'), y: 30 }
            ])
            .render();

        var xLabels = $(instance.svg.selectAll('.x.axis .tick text')[0]);
        expect(xLabels.eq(0).text()).toBe('10:00');
        expect(xLabels.eq(1).text()).toBe('11:00');
        expect(xLabels.eq(2).text()).toBe('12:00');
    });

    it('should used formatter function if defined', function () {
        var text = 'some text for the axis';
        var formatter = function () { return text; };
        instance = createinstance({ xAxis: { firstAndLast: false, labels: { formatter: formatter } }})
            .nullVis([
                { x: new Date('10/11/2013 10:00'), y: 10 },
                { x: new Date('10/11/2013 11:00'), y: 20 },
                { x: new Date('10/11/2013 12:00'), y: 30 }
            ])
            .render();

        var xLabels = $(instance.svg.selectAll('.x.axis .tick text')[0]);
        expect(xLabels.eq(0).text()).toBe(text);
        expect(xLabels.eq(1).text()).toBe(text);
        expect(xLabels.eq(2).text()).toBe(text);

    });

    describe('with the linearDomain options set to true', function () {
        it('should partition the x axis in equal steps regardless of the actual date/time', function () {
            var data = [
                    { x: new Date('10/11/2013 10:00'), y: 10 },
                    { x: new Date('10/11/2013 11:00'), y: 20 },
                    { x: new Date('12/11/2013 10:00'), y: 30 }
                ];
            var instance = createinstance({ chart: { width: 400 }, xAxis: { linearDomain: true, firstAndLast: false }})
                .nullVis(data)
                .render();

            var xLabels = $(instance.svg.selectAll('.x.axis .tick text')[0]);
            var w = instance.options.chart.plotWidth;

            expect(instance.xScale(data[0].x)).toBe(0);
            expect(instance.xScale(data[1].x)).toBe(Math.round(w/2));
            expect(instance.xScale(data[2].x)).toBe(w);

        });
    });

});
