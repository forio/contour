describe('Visualizations', function () {
    var nw;
    var el, $el;
    var data = [1,2,3];

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
                expect(nw.line(data)).toEqual(nw);
            });

            it('should add a visualization renderer to the visualizations array', function () {
                expect(nw.visualizations.length).toBe(0);
                nw.line(data);
                expect(nw.visualizations.length).toBe(1);
            });

            it('should accept an 1-dimension array as data set', function () {
                nw.line([1,2,3]).render();
                var paths = $el.find('g[vis-id="1"] path');

                expect(paths.length).toBe(1);
                expect(paths.eq(0).attr('d').length).toBeGreaterThan(0);
            });

            it('should render more than 1 series if passed in', function () {
                nw.line([{
                    name: 's1',
                    data: [1,2,3]
                },{
                    name: 's2',
                    data: [1,2,3]
                }]).render();

                var paths = $el.find('g[vis-id="1"] path');
                expect(paths.length).toBe(2);
                expect(paths.eq(0).attr('d').length).toBeGreaterThan(0);
                expect(paths.eq(1).attr('d').length).toBeGreaterThan(0);
            });

            it('should add the name of the series as a class series-name to each path', function () {
                nw.line([{
                    name: 's1',
                    data: [1,2,3]
                },{
                    name: 's2',
                    data: [1,2,3]
                }]).render();

                var paths = $el.find('g[vis-id="1"] path');

                expect(paths.eq(0).attr('class')).toContain('series-s1');
                expect(paths.eq(1).attr('class')).toContain('series-s2');
            });
        });

        describe('render visualization', function () {
            beforeEach(function () {
                nw.line(data).render();
            });

            it('should add a group with the visualization id', function () {
                expect($el.find('g [vis-id="1"]').length).toBe(1);
            });

            it('should be translated to the plot area', function () {
                var padding = nw.options.chart.padding;
                expect($el.find('g[vis-id="1"]').attr('transform')).toEqual('translate(' + padding.left +',' + padding.top +')');
            });

            it('should add a path per series', function (){
                var g = $el.find('g [vis-id="1"]');
                expect(g.find('path').length).toBe(1);
            });

            it('should add the class line to the path element', function () {
                var path = $el.find('g[vis-id="1"] path');
                expect(path.attr('class')).toContain('line');
            });


        });

    });
});

