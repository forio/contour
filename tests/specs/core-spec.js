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
    });

    describe('render', function () {

        beforeEach(function () {
        });

        it('should create an svg element inside the container', function () {
            createNarwhal().render();
            expect($el.find('svg').length).toEqual(1);
        });

        it('should take the dimensions from the options', function () {
            createNarwhal({ chart: { width: 100, height: 100 } }).render();

            var width = +$el.find('svg').attr('width');
            var height = +$el.find('svg').attr('height');
            expect(width).toEqual(100);
            expect(height).toEqual(100);
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

    });

});
