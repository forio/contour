describe('Cartesian', function () {
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


    describe('constructor', function () {


    });

    describe('render', function () {


    });

});
