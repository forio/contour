describe('Narwhal', function () {
    var $el, el;
    var narwhal;

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createNarwhal(options) {
        options = _.extend({ el: el }, options);
        narwhal = new Narwhal(options);
        return narwhal;
    }

    it('should add export functionality to Narwha function object (static method)', function () {
        expect(Narwhal.export).toBeDefined();
    });

    describe('export', function () {
        var exportedVisRenderer;
        beforeEach(function () {
            exportedVisRenderer = function () {};
        });

        it('should throw if passed and invalid constructor', function () {
            expect(_.bind(Narwhal.export, Narwhal, 'some', 'thing')).toThrow();
            expect(_.bind(Narwhal.export, Narwhal, 'some')).toThrow();
            expect(_.bind(Narwhal.export, Narwhal, 'some', exportedVisRenderer)).not.toThrow();
        });

        it('should add functionality to Narwal\'s prototype', function () {
            Narwhal.export('someFunc', exportedVisRenderer);

            expect(Narwhal.prototype.someFunc).toBeDefined();
        });

        it('should generate an chainable constructor for the visualization', function () {
            Narwhal.export('somethingElse', exportedVisRenderer);
            var target = createNarwhal();
            expect(target.somethingElse()).toBe(target);
        });

        // the datum functionality is in catesian, so we need to move this there
        xit('should bind normalized constructor data when data is an array', function () {
            var dataParam;
            Narwhal.export('something', function (data) {
                dataParam = data;
            });

            var target = createNarwhal();
            target.something([1,2,3]).render();
            expect(dataParam[0].x).toBe(0);
            expect(dataParam[0].y).toBe(1);
        });

        it('should bind unmodified constructor data when data is not an array', function () {
            var dataParam;
            Narwhal.export('something', function (data) {
                dataParam = data;
            });

            var target = createNarwhal();
            target.something('some parameter').render();
            expect(dataParam).toBe('some parameter');
        });

        it('should merge default options defined in render function', function () {
            function render() {};
            render.defaults = { vis: { xyz: 10} };
            Narwhal.export('vis', render);

            nw = new Narwhal({}).vis().render();
            expect(nw.options.vis).toBeDefined();
            expect(nw.options.vis.xyz).toBe(10);
        });

        it('should allow to override default options defined in render function', function () {
            function render() {};
            render.defaults = { vis: { xyz: 10} };
            Narwhal.export('vis', render);

            nw = new Narwhal({ vis: { xyz: 30 } }).vis().render();
            expect(nw.options.vis).toBeDefined();
            expect(nw.options.vis.xyz).toBe(30);
        });
    });

    describe('constructor', function () {
        it('should provide a visualizations array in the options', function () {
            createNarwhal();
            expect(narwhal.visualizations).toBeDefined();
        });
    });


    describe('expose', function () {
        it('should not expose passed in object, until the constructor is called', function () {
            // extend the prototype, exposing a new constructor myTest
            Narwhal.expose('myTest', { someFunction: $.noop });

            var target = createNarwhal();

            expect(target.myTest).toBeDefined();

            expect(target.someFunction).not.toBeDefined();

            // now we should have it, call the constructor
            target.myTest();

            // now we should have the actual functionality exposed by myTest
            expect(target.someFunction).toBeDefined();
        });

        it('should make the new object available in the instance', function () {
            Narwhal.expose('myTest', { someFunction: $.noop });

            var target = createNarwhal();
            expect(target.myTest).toBeDefined();
        });

        it('should NOT affect other instance of Narwhal', function () {
            Narwhal.expose('myTest', { someFunction: $.noop });

            var target = createNarwhal();
            target.myTest();
            var other = createNarwhal();
            expect(other.someFunction).not.toBeDefined();
            expect(target.someFunction).toBeDefined();
        });

        it('should return the instance (this) after calling the constructor', function () {
            Narwhal.expose('myTest', { some: $.noop });

            var target = createNarwhal();
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
            createNarwhal().render();
            expect($el.find('svg').length).toEqual(1);
        });

        it('should take the dimensions from the options', function () {
            createNarwhal({ chart: { width: 100, height: 200 } }).render();

            var bounds = getBounds();
            expect(bounds.width).toEqual(100);
            expect(bounds.height).toEqual(200);
        });

        it('should default to width=400 if no option is given and no container has no width', function () {
            createNarwhal().render();

            var bounds = getBounds();
            expect(bounds.width).toEqual(400);
        });

        it('should default to height=247 if no option is given and no container has no height', function () {
            createNarwhal().render();

            var bounds = getBounds();
            expect(bounds.height).toEqual(247);
        });

        it('should get the container width if it has it', function () {
            $el.css({width: '120px', height: '30px '});
            createNarwhal().render();

            var bounds = getBounds();
            expect(bounds.width).toEqual(120);
        });

        it('should get the container height if it has it', function () {
            $el.css({width: '120px', height: '30px '});
            createNarwhal().render();

            var bounds = getBounds();
            expect(bounds.height).toEqual(30);
        });

        it('should calculate height if width & aspect are specificed', function () {
            createNarwhal({ chart: { width: 100, aspect: 2 }}).render();

            var bounds = getBounds();
            expect(bounds.height).toEqual(200);
        });

        it('should calculate height from container width & aspect are specificed', function () {
            $el.css({ width: '100px' });
            createNarwhal({ chart: { aspect: 1.5 }}).render();

            var bounds = getBounds();
            expect(bounds.height).toEqual(150);
        });

        it('should include a viewbox & preserveAspectRatio attributes for the svg', function () {
            createNarwhal({ chart: { width: 100, height: 200 } }).render();

            // cant use jquery to get the viewBox... svg is not supposed to be supported in jquery
            // http://bugs.jquery.com/ticket/11166
            var svg = d3.select($el.find('svg').get(0));
            var viewBox = svg.attr('viewBox');
            var preserve = svg.attr('preserveAspectRatio');

            expect(viewBox).toBe('0 0 100 200');    // form the width&hegiht passed in the options
            expect(preserve).toBe('xMinYMin');
        });

        it('should position chart area using the provided margins', function () {
            createNarwhal({
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
            var mock = { render: function () { }};
            var target = createNarwhal();
            spyOn(mock, 'render');

            target.visualizations.push(mock.render);
            target.render();

            expect(mock.render).toHaveBeenCalled();
        });

    });

    describe('renderVisualizations', function () {
        it('should call each visualization on the list', function () {
            var target = createNarwhal();
            var called = false;

            target.visualizations.push(function () { called = true && this === target; } );
            target.render();
            expect(called).toBe(true);
        });

        it('should call each visualization with the context of the narwhal instance', function () {
            var target = createNarwhal();
            var context;

            target.visualizations.push(function () { context = this; } );
            target.render();
            expect(context).toEqual(target);
        });

        it('should pass the visualization id as parameter', function () {
            var target = createNarwhal();
            var theId = 0;
            var mock = { render: function (svg, options, id) { theId = id; }};

            target.visualizations.push(mock.render);

            target.render();

            expect(theId).toBe(1);
        });

    });



});
