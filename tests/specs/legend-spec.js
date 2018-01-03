import $ from 'jquery';
import Contour from '../../src/scripts/core/contour';
import '../../src/scripts/core/cartesian';
import '../../src/scripts/visualizations/legend';

describe('Legend Visualization', function () {
    var $el, el;
    var instance;


    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
    });

    function createinstance(options) {
        $el = $('<div>');
        el = $el.get(0);
        options = Object.assign({ el: el }, options);

        instance = new Contour(options).cartesian();
        return instance;
    }

    it('should create a div with the text for each data series', function () {
        var data = [
            { name: 'name-1', data: [] },
            { name: 'name-2', data: [] }
        ];

        createinstance().nullVis(data).legend(data).render();

        var entries = $el.find('.contour-legend .contour-legend-entry');
        expect(entries.length).toBe(2);
        expect(entries.eq(0).text()).toBe('name-1');
        expect(entries.eq(1).text()).toBe('name-2');
    });

});
