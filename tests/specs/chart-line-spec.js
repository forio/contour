import $ from 'jquery';
import d3 from 'd3';
import Contour from '../../src/scripts/core/contour';
import { intersection } from '../../src/scripts/utils/contour-utils';
import '../../src/scripts/core/cartesian';
import '../../src/scripts/visualizations/null';
import '../../src/scripts/visualizations/line';
import LinearScale from '../../src/scripts/core/axis/linear-scale-axis';
import OrdinalScale from '../../src/scripts/core/axis/ordinal-scale-axis';

describe('Visualizations', function () {
    var nw;
    var el, $el;
    var data = [1,2,3];
    function createContour(options) {
        $el.empty();
        options = Object.assign({ el: el, chart: { animations: false } }, options);
        var contour = new Contour(options).cartesian();
        return contour;
    }

    describe('Line Chart', function () {
        beforeEach(function () {
            $el = $('<div>');
            el = $el.get(0);
        });

        describe('without animations', function () {
            beforeEach(function () {
                nw = createContour();
            });

            it('should add a constructor function to the Contour prototype', function () {
                expect(Contour.prototype.line).toBeDefined();
            });


            describe('constructor', function () {

                it('should return this (Contour instance)', function () {
                    expect(nw.line(data)).toEqual(nw);
                });

                it('should accept an 1-dimension array as data set', function () {
                    nw.line([1,2,3]).render();
                    var paths = $el.find('.s-1 path');

                    expect(paths.length).toBe(1);
                    expect(paths.eq(0).attr('d').length).toBeGreaterThan(0);
                });

                it('should render more than 1 series if passed in', function () {
                    nw.line([{
                        name: 's1',
                        data: [1,2,3]
                    },{
                        name: 's2',
                        data: [1,2,3]
                    }]).render();

                    var paths = $el.find('.series path');
                    expect(paths.length).toBe(2);
                    expect(paths.eq(0).attr('d').length).toBeGreaterThan(0);
                    expect(paths.eq(1).attr('d').length).toBeGreaterThan(0);
                });

                it('should add the name of the series as a class series-name to each path\'s group', function () {
                    nw.line([{
                        name: 's1',
                        data: [1,2,3]
                    },{
                        name: 's2',
                        data: [1,2,3]
                    }]).render();

                    var paths = $el.find('g[vis-id="1"]').children();

                    expect(paths.eq(0).attr('class')).toContain('s1');
                    expect(paths.eq(1).attr('class')).toContain('s2');
                });
            });

            describe('render visualization', function () {
                beforeEach(function () {
                    nw.line(data).render();
                });

                it('should default to linear x scale', function () {
                    var chart = createContour();
                    chart.line([1,2,3]).render();
                    expect(chart.xScaleGenerator instanceof LinearScale).toBeTruthy();
                });

                it('should render as ordinal scale if categorical data is passed in', function () {
                    var chart = createContour();
                    chart.line([{x: 'a', y: 1}, {x: 'b', y: 2}]).render();
                    expect(chart.xScaleGenerator instanceof OrdinalScale).toBeTruthy();
                });

                it('should add a group with the visualization id', function () {
                    expect($el.find('[vis-id="1"]').length).toBe(1);
                });

                it('should be translated to the plot area', function () {
                    var padding = nw.options.chart.padding;
                    expect($el.find('g[vis-id="1"]').attr('transform')).toEqual('translate(' + nw.options.chart.internalPadding.left +',' + padding.top +')');
                });

                it('should add a path per series', function (){
                    nw = createContour();
                    nw.line([{
                        name: 's1',
                        data: [1,2,3]
                    },{
                        name: 's2',
                        data: [1,2,3]
                    }]).render();

                    var g = $el.find('g[vis-id="1"]');
                    expect(g.children().eq(0).find('path').length).toBe(1);
                    expect(g.children().eq(1).find('path').length).toBe(1);
                });

                it('should add the class line to the path element', function () {
                    var path = $el.find('.s-1 path');
                    expect(path.attr('class')).toContain('line');
                });

                describe('with tooltips disabled', function () {
                    beforeEach(function () {
                        nw = createContour({tooltip: { enable: false }}).line(data).render();
                    });

                    it('should NOT add any tooltip tracker marker', function () {
                        var trackers = $el.find('g[vis-id="1"] .tooltip-tracker');
                        expect(trackers.length).toBe(0);
                    });

                });


                describe('with tooltips enabled', function () {
                    beforeEach(function () {
                        nw = createContour({tooltip: { enable: true }}).line(data).render();
                    });

                    it('should add a marker tooltip target for each data point', function () {
                        var trackers = $el.find('.s-1 .tooltip-tracker');
                        expect(trackers.length).toBe(data.length);
                    });

                    it('should add a tooltip trackers AFTER line markers', function () {
                        var groups = $el.find('g[vis-id="1"]').children();
                        expect(groups.eq(1).attr('class')).toContain('line-chart-markers');
                        expect(groups.eq(2).attr('class')).toContain('tooltip-trackers');
                    });

                    // to hide some markers with their trackers, we need to be able to select
                    // trackers for a specific series (issue #173)
                    xit('should append the series name and number to the tooltip tracker class', function () {
                        var g = $el.find('g[vis-id="1"] .tooltip-trackers');
                        var seriesClasses = ['s-1', 'series', '1'];
                        var classes = d3.select(g[0]).attr('class').split(' ');

                        var inter = intersection(classes, seriesClasses);
                        expect(inter).toEqual(seriesClasses);
                    });


                });

            });

            describe('render with special case data', function () {
                it('should not render markers when the data Y is null or undefined', function () {
                    nw = createContour().line([
                        { x: 1, y: 10},
                        { x: 2, y: null},
                        { x: 3}
                    ]).render();

                    var markers = $el.find('.line-chart-markers circle');
                    expect(markers.length).toBe(1);
                });

            });

        });

        describe('with animations', function () {
            beforeEach(function () {
                jasmine.Clock.useMock();
                nw = new Contour({ el: el, chart: { animations: true }}).cartesian();
                nw.line([1,2,3,4]);
            });

            xit('should animate path', function () {
                // need to figure out a way to test the animation
                // this does not work right now.
                nw.render();

                var path = $el.find('g[vis-id="1"] path');
                expect(path.attr('d')).not.toBeDefined();

                jasmine.Clock.tick(1000);

                path = $el.find('g[vis-id="1"] path');
                expect(path.attr('d')).toBeDefined();

            });
        });

    });

});

