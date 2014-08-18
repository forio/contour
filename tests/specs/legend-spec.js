describe('Legend Visualization', function () {
    var $el, el;
    var instance;


    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
        document.body.appendChild(el);
    });

    afterEach(function () {
        document.body.removeChild(el);
    })

    function createinstance(options) {
        options = _.extend({ el: el }, options);

        instance = new Contour(options).cartesian();
        return instance;
    }

    it('should create a div with the text for each data series', function () {
        var data = [
            { name: 'name-1', data: [] },
            { name: 'name-2', data: [] }
        ];

        createinstance().nullVis(data).legend(data).render();

        var entries = $el.find('div.contour-legend .contour-legend-entry');
        expect(entries.length).toBe(2);
        expect(entries.eq(0).text()).toBe('name-1');
        expect(entries.eq(1).text()).toBe('name-2');
    });

    it('should create a svg text with the text for each data series', function () {
        var data = [
            { name: 'name-1', data: [] },
            { name: 'name-2', data: [] }
        ];

        createinstance().nullVis(data).legend(data).render();

        var entries = $el.find('g[vis-type="legend"] g.contour-legend g.contour-legend-entry');
        expect(entries.length).toBe(2);
        expect(entries.eq(0).find('text').text()).toBe('name-1');
        expect(entries.eq(1).find('text').text()).toBe('name-2');
    });

});
