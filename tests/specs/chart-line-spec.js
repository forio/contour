describe('Visualizations', function () {
    var nw;
    var el, $el;
    var data = [1,2,3];


    function createNarwhal(options) {
        $el.empty();
        options = _.extend({ el: el, chart: { animations: false } }, options);
        var narwhal = new Narwhal(options).cartesian();
        return narwhal;
    }

    describe('Line Chart', function () {
        beforeEach(function () {
            $el = $('<div>');
            el = $el.get(0);
        });

        describe('without animations', function () {
            beforeEach(function () {
                nw = createNarwhal();
            });

            it('should add a constructor function to the Narwhal prototype', function () {
                expect(Narwhal.prototype.line).toBeDefined();
            });


            describe('constructor', function () {

                it('should return this (Narwhal instance)', function () {
                    expect(nw.line(data)).toEqual(nw);
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

                    expect(paths.eq(0).attr('class')).toContain('s1');
                    expect(paths.eq(1).attr('class')).toContain('s2');
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
                    nw = createNarwhal();
                    nw.line([{
                        name: 's1',
                        data: [1,2,3]
                    },{
                        name: 's2',
                        data: [1,2,3]
                    }]).render();

                    var g = $el.find('g [vis-id="1"]');
                    expect(g.find('path').length).toBe(2);
                });

                it('should add the class line to the path element', function () {
                    var path = $el.find('g[vis-id="1"] path');
                    expect(path.attr('class')).toContain('line');
                });

                it('should add a marker tooltip target for each data point', function () {
                    var trackers = $el.find('g[vis-id="1"] .tooltip-tracker');
                    expect(trackers.length).toBe(data.length);
                });

                it('should add a tooltip trackers AFTER line markers', function () {
                    var groups = $el.find('g[vis-id="1"] g');
                    expect(groups.eq(0).attr('class')).toContain('line-chart-markers');
                    expect(groups.eq(1).attr('class')).toContain('tooltip-trackers');
                });
            });

            describe('render with special case data', function () {
                it('should not render markers when the data Y is null or undefined', function () {
                    nw = createNarwhal().line([
                        { x: 1, y: 10},
                        { x: 2, y: null},
                        { x: 3}
                    ]).render();

                    var markers = $el.find('g[vis-id="1"] .line-chart-markers circle');
                    expect(markers.length).toBe(1);
                });

            });

        });

        describe('with animations', function () {
            beforeEach(function () {
                jasmine.Clock.useMock();
                nw = new Narwhal({ el: el, chart: { animations: true }}).cartesian();
                nw.line([1,2,3,4]);
            });

            xit('should animate path', function () {
                // need to figure out a way to test the animation
                // this does not work right now.
                nw.render();

                var path = $el.find('g[vis-id="1"] path');
                expect(path.attr('d')).not.toBeDefined();

                jasmine.Clock.tick(1000);

                path = $el.find('g[vis-id="1"] path');
                expect(path.attr('d')).toBeDefined();

            });
        });

    });

});

