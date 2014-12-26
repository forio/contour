describe('Exportable extension', function () {
    var $el, el;
    var data = [1, 2];
    var instance;

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
        // div must have layout in order to compare sizes
        document.body.appendChild(el);
    });

    afterEach(function () {
        document.body.removeChild(el);
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
            .exportable();
        return instance;
    }

    describe('Place image', function () {
        var $container, container;
        var $img, img;

        beforeEach(function () {
            $container = $('<div>');
            container = $container.get(0);
            // image must have layout in order to compare sizes
            document.body.appendChild(container);

            createinstance();
            instance.render();

            runs(function () {
                instance.place({
                    target: container
                });
            });

            waitsFor(function () {
                $img = $container.find('img');
                if ($img.length !== 1) return false;
                img = $img.get(0);
                return img.offsetWidth > 0 || img.offsetHeight > 0;
            }, 'The image should be created and loaded', 2000);
        });

        afterEach(function () {
            document.body.removeChild(container);
        });

        it('should place an image in the specified container', function () {
            runs(function () {
                expect($img.length).toBe(1);
                expect(img.offsetWidth).toBeGreaterThan(0);
                expect(img.offsetHeight).toBeGreaterThan(0);
            });
        });

        it('should size the image the same dimensions as the chart', function () {
            runs(function () {
                var svg = $el.find('svg').get(0);
                expect(img.offsetWidth).toEqual(svg.offsetWidth);
                expect(img.offsetHeight).toEqual(svg.offsetHeight);
            });

        });
    });
});
