describe('Visualizations', function () {
    describe('Line chart', function () {
        it('should add a constructor function to the Narwhal prototype', function () {
            expect(Narwhal.prototype.line).toBeDefined();
        });


        describe('constructor', function () {

            it('should return this (Narwhal instance)', function () {
                var nw = new Narwhal();
                expect(nw.line([])).toEqual(nw);
            });

            it('should accept an 1-dimension array as data set', function () {

            });
        });

    });
});

