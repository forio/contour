describe('The Basic Tooltip', function () {
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

    function triggerMouseEvent(type, domElemenet) {
        var e = new MouseEvent(type);
        e.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        domElemenet.dispatchEvent(e);
        // var ev = new UIEvent(type);

        // d3.select(domElemenet).node().displatchEvent(ev);
    }

    it('should create hidden a dom element when created', function () {
        createNarwhal()
            .tooltip()
            .render();

        var tooltip = $el.find('.nw-tooltip');

        expect(tooltip.length).toBe(1);
        expect(+tooltip.css('opacity')).toBe(0);
    });

    xit('should show the dom element on mouseOver', function () {
        createNarwhal()
            .line([10,20])
            .tooltip()
            .render();

        var point = $el.find('.tooltip-tracker');
        var tooltip = $el.find('.nw-tooltip');

        triggerMouseEvent('mouseover.tooltip', point.get(0));

        // var handlers = d3.select(point.get(0)).on('mouseover.tooltip');
        // handlers();
        // point.trigger('mouseover.tooltip');
        expect(+tooltip.css('opacity')).toBeGreaterThan(0);

    });

});
