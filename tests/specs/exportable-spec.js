import Contour from '../../src/scripts/core/contour';
import '../../src/scripts/core/exportable';

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
        options = Object.assign({
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

    xdescribe('Place image', function () {
        var $container, container;
        var $img, img;

        beforeEach(function (done) {
            $container = $('<div>');
            container = $container.get(0);
            // image must have layout in order to compare sizes
            document.body.appendChild(container);

            createinstance();
            instance.render();

            instance.place({
                target: container
            });

            setTimeout(function () {
                $img = $container.find('img');
                if ($img.length !== 1) return false;
                img = $img.get(0);
                done();
            }, 2000);
        }, 2000);

        afterEach(function () {
            document.body.removeChild(container);
        });

        it('should place an image in the specified container', function () {
            expect($img.length).toBe(1);
            expect(img.offsetWidth).toBeGreaterThan(0);
            expect(img.offsetHeight).toBeGreaterThan(0);

        });

        it('should size the image the same dimensions as the chart', function () {
            var svg = $el.find('svg').get(0);
            expect(img.offsetWidth).toEqual(svg.offsetWidth);
            expect(img.offsetHeight).toEqual(svg.offsetHeight);
        });
    });
});
