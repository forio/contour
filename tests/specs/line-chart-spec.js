describe('Visualizations', function () {
    var nw;
    var el, $el;

    beforeEach(function () {
        $el = $('<div>');
        el = $el.get(0);
        nw = new Narwhal({ el: el }).cartesian();
    });

    describe('Line chart', function () {
        it('should add a constructor function to the Narwhal prototype', function () {
            expect(Narwhal.prototype.line).toBeDefined();
        });


        describe('constructor', function () {

            it('should return this (Narwhal instance)', function () {
                expect(nw.line([])).toEqual(nw);
            });

            it('should add a visualization renderer to the visualizations array', function () {
                expect(nw.options.visualizations.length).toBe(0);
                nw.line([]);
                expect(nw.options.visualizations.length).toBe(1);
            });

            it('should accept an 1-dimension array as data set', function () {

            });
        });

        describe('render visualization', function () {
            beforeEach(function () {
                nw.line([]).render();
            });

            it('should add a group with the visualization id', function () {
                expect($el.find('g [vis-id="1"]').length).toBe(1);

            });

            xit('should add a text elemenet to the svg', function (){
                expect($el.find('text').length).toBe(1);
            });
        });

    });
});

