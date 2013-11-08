describe('Column chart', function () {

    var nw;
    var el, $el;
    var data = [1,2,3];
    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createNarwhal(options) {
        options = _.extend({ el: el }, options);
        narwhal = new Narwhal(options);
        return narwhal;
    }

    describe('render', function () {
        it('should create one rect per data point', function () {
            createNarwhal().column(data);
            var rects = $el.find('.column');
            expect(rects.lenght).toBe(3);
        })
    });

});
