import $ from 'jquery';
import d3 from 'd3';
import Contour from '../../src/scripts/core/contour';
import * as nwt from '../../src/scripts/utils/contour-utils';

describe('Contour', function () {
    var $el, el;
    var contour;

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createContour(options) {
        options = Object.assign({ el: el }, options);
        contour = new Contour(options);
        return contour;
    }

    it('should add export functionality to Narwha function object (static method)', function () {
        expect(Contour.export).toBeDefined();
    });

    describe('export', function () {
        var exportedVisRenderer;
        beforeEach(function () {
            exportedVisRenderer = function () {};
        });

        it('should throw if passed and invalid constructor', function () {
            expect(Contour.export.bind(contour, 'some', 'thing')).toThrow();
            expect(Contour.export.bind(contour, 'some')).toThrow();
            expect(Contour.export.bind(contour, 'some', exportedVisRenderer)).not.toThrow();
        });

        it('should add functionality to Narwal\'s prototype', function () {
            Contour.export('someFunc', exportedVisRenderer);

            expect(Contour.prototype.someFunc).toBeDefined();
        });

        it('should generate an chainable constructor for the visualization', function () {
            Contour.export('somethingElse', exportedVisRenderer);
            var target = createContour();
            expect(target.somethingElse()).toBe(target);
        });

        describe('data', function () {
            let dataParam;

            it('should always bind normalized data if data is array', function () {
                var dataParam;
                Contour.export('something', function (data) {
                    dataParam = data;
                });

                var target = createContour();
                target.something([1,2,3]).render();

                expect(dataParam[0].name).toBe('series 1');
                expect(dataParam[0].data.length).toBe(3);
                expect(dataParam[0].data[0].x).toBe(0);
                expect(dataParam[0].data[0].y).toBe(1);
            });

            it('it should normalize to category strings when categories are defined', function () {
                Contour.export('something', function (data) {
                    dataParam = data;
                });

                var target = createContour({
                    xAxis: {
                        categories: [1, 2, 3]
                    }
                });

                target.something([1,2,3]).render();

                var s1 = dataParam[0];
                expect(s1.data[0]).toEqual({ x: '1', y: 1});
                expect(s1.data[1]).toEqual({ x: '2', y: 2});
                expect(s1.data[2]).toEqual({ x: '3', y: 3});
            });

            it('when categories array is given, should normalize the data with categories', function () {
                Contour.export('something', function (data) {
                    dataParam = data;
                });

                var target = createContour({
                    xAxis: {
                        categories: ['a', 'b', 'c']
                    }
                });

                target.something([1,2,3]).render();

                var s1 = dataParam[0];
                expect(s1.data[0]).toEqual({ x: 'a', y: 1});
                expect(s1.data[1]).toEqual({ x: 'b', y: 2});
                expect(s1.data[2]).toEqual({ x: 'c', y: 3});

            });

            it('should bind unmodified constructor data when data is not an array', function () {
                var dataParam;
                Contour.export('something', function (data) {
                    dataParam = data;
                });

                var target = createContour();
                target.something('some parameter').render();
                expect(dataParam).toBe('some parameter');
            });

            it('should sort time based data', function () {
                var dataParam;
                Contour.export('something', function (data) {
                    dataParam = data;
                });

                var data = [
                    { x: new Date('2000-01-01T10:00:00Z'), y: 10 },
                    { x: new Date('2010-01-01T10:00:00Z'), y: 10 },
                    { x: new Date('2003-01-01T10:00:00Z'), y: 10 },
                    { x: new Date('2012-01-01T10:00:00Z'), y: 10 }
                ];

                createContour()
                    .something(data)
                    .render();

                expect(dataParam.length).toBe(1);   // 1 series

                var series = dataParam[0];
                expect(series.data.length).toBe(4); // with 4 points
                expect(series.data[0].x.getFullYear()).toBe(2000);
                expect(series.data[1].x.getFullYear()).toBe(2003);
                expect(series.data[2].x.getFullYear()).toBe(2010);
                expect(series.data[3].x.getFullYear()).toBe(2012);
            });
        });

        it('should merge default options defined in render function', function () {
            function render() {}
            render.defaults = { vis: { xyz: 10} };
            Contour.export('vis', render);

            const nw = new Contour({}).vis().render();
            expect(nw.options.vis).toBeDefined();
            expect(nw.options.vis.xyz).toBe(10);
        });

        it('should allow to override default options defined in render function', function () {
            function render() {};
            render.defaults = { vis: { xyz: 10} };
            Contour.export('vis', render);

            const nw = new Contour({ vis: { xyz: 30 } }).vis().render();
            expect(nw.options.vis).toBeDefined();
            expect(nw.options.vis.xyz).toBe(30);
        });

        it('should not override global config options if options are specificed for the visualization', function () {
            // if the options are passed to the Contour constructor, then the instance gets the merged version of the
            // conig object, but if the options are passed in to the visualization as a second parameter, only
            // that visualization should get the version of the config merged with the options.

            var calls = [];
            function render(data, layer, options) {
                calls.push({data: data, opt: options.vis });
            }

            Contour.export('vis', render);

            const nw = new Contour({})
                .vis([{name: 's1', data: [1]}], { option1: 10 })
                .vis([{name: 's2', data:[2]}], { option1: 20 })
                .render();

            expect(calls.length).toBe(2);
            expect(calls[0].data[0].name).toEqual('s1');
            expect(calls[0].opt.option1).toBe(10);
            expect(calls[1].data[0].name).toEqual('s2');
            expect(calls[1].opt.option1).toBe(20);


        });
    });

    describe('expose', function () {
        it('should not expose passed in object, until the constructor is called', function () {
            // extend the prototype, exposing a new constructor myTest
            Contour.expose('myTest', { someFunction: $.noop });

            var target = createContour();

            expect(target.myTest).toBeDefined();

            expect(target.someFunction).not.toBeDefined();

            // now we should have it, call the constructor
            target.myTest();

            // now we should have the actual functionality exposed by myTest
            expect(target.someFunction).toBeDefined();
        });

        it('should make the new object available in the instance', function () {
            Contour.expose('myTest', { someFunction: $.noop });

            var target = createContour();
            expect(target.myTest).toBeDefined();
        });

        it('should NOT affect other instance of Contour', function () {
            Contour.expose('myTest', { someFunction: $.noop });

            var target = createContour();
            target.myTest();
            var other = createContour();
            expect(other.someFunction).not.toBeDefined();
            expect(target.someFunction).toBeDefined();
        });

        it('should return the instance (this) after calling the constructor', function () {
            Contour.expose('myTest', { some: $.noop });

            var target = createContour();
            var result = target.myTest();
            expect(result).toEqual(target);
        });
    });

    describe('render', function () {

        function getBounds() {
            var svg = d3.select($el.find('svg').get(0));
            var viewBox = svg.attr('viewBox').split(' ');
            if (viewBox.length !== 4) throw new Error('the SVG does not have a viewbox to get the dimensions');

            return {
                left: +viewBox[0],
                top: +viewBox[1],
                width: +viewBox[2],
                height: +viewBox[3]
            }
        }

        beforeEach(function () {
        });

        it('should create an svg element inside the container', function () {
            createContour().render();
            expect($el.find('svg').length).toEqual(1);
        });

        it('should take the dimensions from the options', function () {
            createContour({ chart: { width: 100, height: 200 } }).render();

            var bounds = getBounds();
            expect(bounds.width).toEqual(100);
            expect(bounds.height).toEqual(200);
        });

        it('should default to width=400 if no option is given and no container has no width', function () {
            createContour().render();

            var bounds = getBounds();
            expect(bounds.width).toEqual(400);
        });

        it('should default to height=247 if no option is given and no container has no height', function () {
            createContour().render();

            var bounds = getBounds();
            expect(bounds.height).toEqual(247);
        });

        it('should get the container width if it has it', function () {
            $el.css({width: '120px', height: '30px '});
            createContour().render();

            var bounds = getBounds();
            expect(bounds.width).toEqual(120);
        });

        it('should get the container height if it has it', function () {
            $el.css({width: '120px', height: '30px'});
            createContour().render();

            var bounds = getBounds();
            expect(bounds.height).toEqual(30);
        });

        it('should calculate height if width & aspect are specificed', function () {
            createContour({ chart: { width: 100, aspect: 2 }}).render();

            var bounds = getBounds();
            expect(bounds.height).toEqual(200);
        });

        it('should calculate height from container width & aspect are specificed', function () {
            $el.css({ width: '100px' });
            createContour({ chart: { aspect: 1.5 }}).render();

            var bounds = getBounds();
            expect(bounds.height).toEqual(150);
        });

        it('should include a viewbox & preserveAspectRatio attributes for the svg', function () {
            createContour({ chart: { width: 100, height: 200 } }).render();

            // cant use jquery to get the viewBox... svg is not supposed to be supported in jquery
            // http://bugs.jquery.com/ticket/11166
            var svg = d3.select($el.find('svg').get(0));
            var viewBox = svg.attr('viewBox');
            var preserve = svg.attr('preserveAspectRatio');

            expect(viewBox).toBe('0 0 100 200');    // form the width&hegiht passed in the options
            expect(preserve).toBe('xMinYMin');
        });

        it('should position chart area using the provided margins', function () {
            createContour({
                chart: {
                    width: 100,
                    height: 100,
                    margin: { left: 20, right: 20, top: 10, bottom: 10 }
                }
            }).render();

            var svg = $el.find('svg');
            var transform = svg.find('g').attr('transform');
            expect(transform).toEqual('translate(20,10)');
        });

        it('should call visualizations to render!', function () {
            var mock = createVisMock('something', nwt.noop);

            createContour().something().render();

            expect(mock.render).toHaveBeenCalled();
        });

    });

    function createVisMock(name, fn) {
        var mock = { render: fn || function () {} };
        spyOn(mock, 'render');
        Contour.export(name, mock.render);

        return mock;
    }

    describe('renderVisualizations', function () {

        it('should call each visualization with the context of the Contour instance', function () {
            var context = null;
            var mock = { render: function () { context = this; }};
            spyOn(mock, 'render').and.callThrough();
            Contour.export('something', mock.render);
            // createVisMock('something', function () {
            //     context = this;
            // });
            var target = createContour().something().render();
            expect(context).toEqual(target);
        });
    });

    describe('composeOptions', function () {
        var instance;
        var formatter = function () { return 1; };
        beforeEach(function () {
            instance = createContour({
                width: function () { return 80; },
                skip: ['abc'],
                formatter: formatter
            });
        });

        it('should call options to materialzie', function () {
            instance.composeOptions();
            expect(instance.options).toEqual(jasmine.objectContaining({
                width: 80,
            }));
        });
        it('should not materialize skip list plus defaults', function () {
            instance.composeOptions();
            expect(instance.options).toEqual(jasmine.objectContaining({
                skip: ['abc'],
                formatter: formatter
            }));
        });
    });

});
