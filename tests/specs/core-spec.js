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
        var exportedVis;
        beforeEach(function () {
            exportedVis = function () {};
            exportedVis.prototype.render = function () {};
        });

        it('should throw if passed and invalid constructor', function () {
            expect(_.bind(Narwhal.export, Narwhal, 'some', 'thing')).toThrow();
            expect(_.bind(Narwhal.export, Narwhal, 'some')).toThrow();
            expect(_.bind(Narwhal.export, Narwhal, 'some', exportedVis)).not.toThrow();
        });

        it('should add functionality to Narwal\'s prototype', function () {
            Narwhal.export('someFunc', exportedVis);

            expect(Narwhal.prototype.someFunc).toBeDefined();
            expect(Narwhal.prototype.someFunc).toEqual(exportedVis);
        });

    });

    describe('constructor', function () {
        it('should provide a visualizations array in the options', function () {
            createNarwhal();
            expect(narwhal.options.visualizations).toBeDefined();
        });
    });


    describe('expose', function () {
        it('should not expose passed in object, until the constructor is called', function () {
            var target = createNarwhal();
            expect(target.myTest).not.toBeDefined();

            // extend the instance, exposing a new constructor myTest
            target.expose('myTest', { someFunction: $.noop });

            // now we should have it, call the constructor
            expect(target.myTest).toBeDefined();

            target.myTest();

            // now we should have the actual functionality exposed by myTest
            expect(target.someFunction).toBeDefined();
        });

        it('should make the new object available in the instance', function () {
            var target = createNarwhal();
            target.expose('myTest', { someFunction: $.noop });
            expect(target.myTest).toBeDefined();
        });

        it('should NOT affect other instance of Narwhal', function () {
            var target = createNarwhal();
            var other = createNarwhal();
            target.expose('myTest', { someFunction: $.noop });
            expect(other.myTest).not.toBeDefined();
        });

        it('should return the instance (this) after calling the constructor', function () {
            var target = createNarwhal();
            target.expose('myTest', { some: $.noop });
            var result = target.myTest();
            expect(result).toEqual(target);
        });
    });

    describe('render', function () {

        beforeEach(function () {
        });

        it('should create an svg element inside the container', function () {
            createNarwhal().render();
            expect($el.find('svg').length).toEqual(1);
        });

        it('should take the dimensions from the options', function () {
            createNarwhal({ chart: { width: 100, height: 200 } }).render();

            var width = +$el.find('svg').attr('width');
            var height = +$el.find('svg').attr('height');
            expect(width).toEqual(100);
            expect(height).toEqual(200);
        });

        it('should default to width=400 if no option is given and no container has no width', function () {
            createNarwhal().render();

            var width = +$el.find('svg').attr('width');
            expect(width).toEqual(400);
        });

        it('should default to height=247 if no option is given and no container has no height', function () {
            createNarwhal().render();

            var width = +$el.find('svg').attr('height');
            expect(width).toEqual(247);
        });

        it('should get the container width if it has it', function () {
            $el.css({width: '120px', height: '30px '});
            createNarwhal().render();

            var width = +$el.find('svg').attr('width');
            expect(width).toEqual(120);
        });

        it('should get the container height if it has it', function () {
            $el.css({width: '120px', height: '30px '});
            createNarwhal().render();

            var height = +$el.find('svg').attr('height');
            expect(height).toEqual(30);
        });

        it('should calculate height if width & aspect are specificed', function () {
            createNarwhal({ chart: { width: 100, aspect: 2 }}).render();

            var height = +$el.find('svg').attr('height');
            expect(height).toEqual(200);
        });

        it('should calculate height from container width & aspect are specificed', function () {
            $el.css({ width: '100px' });
            createNarwhal({ chart: { aspect: 1.5 }}).render();

            var height = +$el.find('svg').attr('height');
            expect(height).toEqual(150);
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

            target.options.visualizations.push(mock.render);
            target.render();

            expect(mock.render).toHaveBeenCalled();
        });

    });

    describe('visualizations', function () {
        it('should call each visualization on the list', function () {
            var target = createNarwhal();
            var called = false;

            target.options.visualizations.push(function () { called = true && this === target; } );
            target.renderVisualizations();
            expect(called).toBe(true);
        });

        it('should call each visualization with the context of the narwhal instance', function () {
            var target = createNarwhal();
            var context;

            target.options.visualizations.push(function () { context = this; } );
            target.renderVisualizations();
            expect(context).toEqual(target);
        });

    });



});
