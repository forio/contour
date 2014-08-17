describe('Exportable extension', function () {
    var $el, el;
    var data = [1, 2];
    var instance;

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createinstance(options) {
        options = _.extend({
            el: el,
            chart: {
                animations: false
            }
        }, options);

        instance = new Contour(options)
            .cartesian()
            .nullVis(data)
            .exportable()
        return instance;
    }

    describe('Place image', function () {
        var $container, container;

        beforeEach(function () {
            $container = $('<div>');
            container = $container.get(0);

            jasmine.Clock.useMock();
            createinstance();
            instance.render();
            jasmine.Clock.tick(1000);
        });

        it('should place an image in the specified container', function () {
            instance.place({
                target: container
            });
            jasmine.Clock.tick(500);

            var $img = $container.find('img');
            expect($img.length).toBe(1);
            var img = $img.get(0);
            expect(img.offsetWidth).toBeGreaterThan(0);
            expect(img.offsetHeight).toBeGreaterThan(0);
        });

        it('should size the image the same dimensions as the chart', function () {
            instance.place({
                target: container
            });
            jasmine.Clock.tick(500);

            var svg = $el.find('svg').get(0);
            var img = $container.find('img').get(0);
            expect(img.offsetWidth).toEqual(svg.offsetWidth);
            expect(img.offsetHeight).toEqual(svg.offsetHeight);
        });
    });
});
