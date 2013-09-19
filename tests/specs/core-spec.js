describe('Narwhal', function () {
    var $el, el;
    var narwhal;

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);

        narwhal = new Narwhal({
            el: el
        });
    });

    describe('Render', function () {

        beforeEach(function () {
            narwhal.render();
        });

        it('should create an svg element inside the container', function () {
            expect($el.find('svg').length).toEqual(1);
        });

        it('should take the dimensions from the options', function () {
            narwhal = new Narwhal({
                el: el,
                width: 100,
                height: 100
            });

            var width = $el.find('svg').attr('width');
            var height = $el.find('svg').attr('height');
            expect(width).toEqual('100px');
            expect(height).toEqual('100px');
        });

    });

});
