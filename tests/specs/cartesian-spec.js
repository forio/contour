describe('Cartesian frame', function () {
    var $el, el;
    var narwhal;

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createNarwhal(options) {
        options = _.extend({ el: el }, options);
        narwhal = new Narwhal(options).cartesian();
        return narwhal;
    }

    it('should expose "cartesian" constructor function', function () {
        expect(Narwhal.prototype.cartesian).toBeDefined();
    });

    describe('constructor', function () {
    });

    describe('render', function () {
        // this should be in the render, because is data dependent
        it('should provide scaling function (xScale & yScale) for visualizations to use', function () {
            var target = createNarwhal()
                .data([1,2,3])
                .render();

            expect(target.xScale).toBeDefined();
            expect(target.yScale).toBeDefined();
        });
    });

    describe('default xScale', function () {
        beforeEach(function () {
            narwhal = createNarwhal();
        });

        it('should throw if no data is set', function () {
            expect(narwhal.render).toThrow();
        });

        it('should be an ordinal scaling', function () {
            narwhal.data([0,10,20,30]).render();

            expect(narwhal.xScale(0)).toEqual(0);
            expect(narwhal.xScale(1)).toEqual(100);
            expect(narwhal.xScale(2)).toEqual(200);
            expect(narwhal.xScale(3)).toEqual(300);
        });

    });

});
