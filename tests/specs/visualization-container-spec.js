describe('Visualization container', function () {

    describe('extents of stacked chart', function () {
        it('with all negative values, should return correct extents', function () {
            viz = new Contour.VisualizationContainer([{data: [-1]}, {data: [-2]}], null, {stacked: true}, 'col');
            expect(viz.yExtent).toEqual([-3,-3]);
        });

        it('with all positive values, should return correct extents', function () {
            viz = new Contour.VisualizationContainer([{data: [1]}, {data: [2]}], null, {stacked: true}, 'col');
            expect(viz.yExtent).toEqual([3,3]);
        });

        it('with mix of positive and negative values, should return correct extents', function () {
            viz = new Contour.VisualizationContainer([{data: [2, -1]}, {data: [2, -2]}], null, {stacked: true}, 'col');
            expect(viz.yExtent).toEqual([-3,4]);
        });



    });

});