import VisualizationContainer from '../../src/scripts/utils/visualization-container';

describe('Visualization container', function () {

    describe('extents with invalid values', function () {
        it('should filter out NaN values from extent calculation', function () {
            const viz = new VisualizationContainer([{data: [1, NaN, 10]}], {stacked: false}, 'line');
            viz.normalizeData({ line: viz.options });
            expect(viz.yExtent).toEqual([1, 10]);
        });

        it('should filter out Infinity values from extent calculation', function () {
            const viz = new VisualizationContainer([{data: [5, Infinity, -Infinity, 15]}], {stacked: false}, 'line');
            viz.normalizeData({ line: viz.options });
            expect(viz.yExtent).toEqual([5, 15]);
        });

        it('should filter out very large sentinel values (Vensim NaN) from extent calculation', function () {
            const viz = new VisualizationContainer([{data: [10, -1e38, 20]}], {stacked: false}, 'line');
            viz.normalizeData({ line: viz.options });
            expect(viz.yExtent).toEqual([10, 20]);
        });

        it('should filter out null values from extent calculation', function () {
            const viz = new VisualizationContainer([{data: [3, null, 7]}], {stacked: false}, 'line');
            viz.normalizeData({ line: viz.options });
            expect(viz.yExtent).toEqual([3, 7]);
        });

        it('should handle mixed series with different valid data ranges', function () {
            const viz = new VisualizationContainer([
                {data: [10, 15, 20, NaN, NaN]},
                {data: [8, 12, 18, 22, 25]}
            ], {stacked: false}, 'line');
            viz.normalizeData({ line: viz.options });
            expect(viz.yExtent).toEqual([8, 25]);
        });

        it('should return empty array when all values are invalid', function () {
            const viz = new VisualizationContainer([{data: [NaN, Infinity, null]}], {stacked: false}, 'line');
            viz.normalizeData({ line: viz.options });
            expect(viz.yExtent).toEqual([]);
        });
    });

    describe('extents of stacked chart', function () {
        it('with all negative values, should return correct extents', function () {
            const viz = new VisualizationContainer([{data: [-1]}, {data: [-2]}], { stacked: true}, 'col');
            viz.normalizeData({ col: viz.options });
            expect(viz.yExtent).toEqual([-3,-3]);
        });

        it('with all positive values, should return correct extents', function () {
            const viz = new VisualizationContainer([{data: [1]}, {data: [2]}], {stacked: true}, 'col');
            viz.normalizeData({ col: viz.options });
            expect(viz.yExtent).toEqual([3,3]);
        });

        it('with mix of positive and negative values, should return correct extents', function () {
            const viz = new VisualizationContainer([{data: [2, -1]}, {data: [2, -2]}], {stacked: true}, 'col');
            viz.normalizeData({ col: viz.options });
            expect(viz.yExtent).toEqual([-3,4]);
        });

        it('should filter out invalid values in stacked extent calculation', function () {
            const viz = new VisualizationContainer([
                {data: [1, NaN, 3]},
                {data: [2, 4, Infinity]}
            ], {stacked: true}, 'col');
            viz.normalizeData({ col: viz.options });
            expect(viz.yExtent).toEqual([3, 4]);
        });

        it('should handle stacked data with Vensim sentinel values', function () {
            const viz = new VisualizationContainer([
                {data: [10, -1e38]},
                {data: [5, 15]}
            ], {stacked: true}, 'col');
            viz.normalizeData({ col: viz.options });
            expect(viz.yExtent).toEqual([15, 15]);
        });
    });
});