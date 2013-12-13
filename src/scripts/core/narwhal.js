(function () {

    var root = this;

    var defaults = {
        chart: {
            animations: true,
            // by default take the size of the parent container
            defaultWidth: 400,
            // height = width * ratio
            defaultAspect: 1 / 1.61803398875,
            // calculated at render time based on the options & container
            width: undefined,
            // if defined, height takes precedence over aspect
            height: undefined,
            // margin between the container and the chart (ie labels or axis title)
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            // padding between the chart area and the inner plot area */
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        },

        xAxis: {
        },

        yAxis: {
        },

        tooltip: {
        }
    };

    /**
    * Narwhal visualization constructor
    *
    * @class Narwhal() visualizations object
    * @param {object} options The global options object
    * @see {@link config}
    *
    */
    function Narwhal (options) {
        this.init(options);
        return this;
    }

    /**
    * Exposes functionality to the core Narwhal object.
    * This is used to add base functionality to be used by viasualizations
    * for example the `cartesian` frame is implemented exposing functionality.
    *
    * Example:
    *
    *
    *     Narwhal.expose("example", {
    *          // when included in the instance, this will expose `.transformData` to the visualizations
    *         transformData: function(data) { .... }
    *     });
    *
    *     // To include the functionality into a specific instance
    *     new Narwhal(options)
    *           .example()
    *           .visualizationsThatUsesTransformDataFunction()
    *           .render()
    */
    Narwhal.expose = function (ctorName, functionality) {
        var ctor = function () {
            // extend the --instance-- we don't want all charts to be overriden...
            _.extend(this, _.omit(functionality, 'init'));

            if(functionality.init) functionality.init.call(this, this.options);

            return this;
        };

        Narwhal.prototype[ctorName] = ctor;

        return this;
    },

    /**
    * Adds a visualization to be rendered in the instance of Narwhal
    * This is the main way to expose visualizations to be used
    *
    * @param {String} ctorName Name of the visualization to be used as a contructor name
    * @param {Function} renderer Function that will be called to render the visualization. The function will recieve the data that was passed in to the constructor function
    * @see options
    */
    Narwhal.export = function (ctorName, renderer) {

        if (typeof renderer !== 'function') throw new Error('Invalid render function for ' + ctorName + ' visualization');

        function sortSeries(data) {
            if(!data || !data.length) return [];

            if(data[0].data) {
                _.each(data, sortSeries);
            }

            var shouldSort = _.isObject(data[0]) && _.isDate(data[0].x);
            var sortFunc = function (a, b) { return a.x - b.x; };
            if(shouldSort) {
                data.sort(sortFunc);
            }

            return data;
        }

        Narwhal.prototype[ctorName] = function (data, options) {
            data = data || [];
            sortSeries(data);
            renderer.defaults = renderer.defaults || {};
            var categories = this.options ? this.options.xAxis ? this.options.xAxis.categories : undefined : undefined;
            var opt = {};
            // merge the options passed ito Narwhal's constructor and this vis constructor
            // into a set of options to be merged with the defaults and back into narwhal global options object
            opt[ctorName] = $.extend(true, {}, this.options[ctorName], options);
            $.extend(true, this.options, renderer.defaults, opt);

            var renderFunc;
            if (_.isArray(data)) {
                var datums = _.nw.normalizeSeries(data, categories);
                this.data(datums);
                renderFunc = _.partial(renderer, datums);
            } else {
                renderFunc = _.partial(renderer, data);
            }

            this.visualizations.push(renderFunc);

            return this;
        };
    };



    Narwhal.prototype = _.extend(Narwhal.prototype, {

        // Initializes the instance of Narwhal
        init: function (options) {
            // for now, just  store this options here...
            // the final set of options will be composed before rendering
            // after all components/visualizations have been added
            this.options = options;

            this.visualizations = [];

            return this;
        },

        calculateWidth: function () {
            return parseInt($(this.options.el).width(), 10) || this.options.chart.defaultWidth;
        },

        calculateHeight: function () {
            var containerHeight = parseInt($(this.options.el).height(), 10);
            var calcWidth = this.options.chart.width;
            var ratio = this.options.chart.aspect || this.options.chart.defaultAspect;

            return !!containerHeight ?  containerHeight : Math.round(calcWidth * ratio);
        },

        calcMetrics: function () {
            var options = this.options;

            this.adjustPadding();

            this.adjustTitlePadding();

            options.chart.width = options.chart.width || this.calculateWidth();
            options.chart.height = options.chart.height || this.calculateHeight();

            this.options = $.extend(true, options, {
                chart: {
                    plotWidth: options.chart.width - options.chart.margin.left - options.chart.margin.right - options.chart.padding.left - options.chart.padding.right,
                    plotHeight: options.chart.height - options.chart.margin.top - options.chart.margin.bottom - options.chart.padding.top - options.chart.padding.bottom
                }
            });
        },

        adjustPadding: function () {
            // overriden by components that need to adjust padding
            return this;
        },

        adjustTitlePadding: function () {
            // overriden by components that need to adjust padding
            return this;
        },

        composeOptions: function () {
            // compose the final list of options right before start rendering
            this.options = $.extend(true, {}, defaults, this.options);
        },

        baseRender: function () {
            this.plotArea();

            return this;
        },

        render: function () {
            this.composeOptions();

            this.calcMetrics();

            this.baseRender();

            this.renderVisualizations();

            return this;
        },

        plotArea: function () {

            var chartOpt = this.options.chart;

            this.container = d3.select(this.options.el);
            this.container.empty();

            this.svg = this.container
                .append('svg')
                    .attr('viewBox', '0 0 ' + chartOpt.width + ' ' + chartOpt.height)
                    .attr('preserveAspectRatio', 'xMinYMin')
                    .attr('class', 'narwhal-chart')
                    .attr('height', chartOpt.height)
                .append('g')
                    .attr('transform', 'translate(' + chartOpt.margin.left + ',' + chartOpt.margin.top + ')');

            return this;
        },

        createVisualizationLayer: function (id) {
            return this.svg.append('g')
                .attr('vis-id', id)
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + this.options.chart.padding.top + ')');
        },

        renderVisualizations: function () {
            _.each(this.visualizations, function (visualization, index) {
                var id = index + 1;
                var layer = this.createVisualizationLayer(id);
                visualization.call(this, layer, this.options, id);
            }, this);

            return this;
        },

        compose: function(ctorName, funcArray) {
            // compose differnt functional objects into this instance...
            // this way we can do something like new Narwhal().BarChart(...) and it includes
            // cartesia, xAxis, yAxis, tooltip, highliter, etc...
        },

        // place holder function for now
        data: function () {

        }
    });

    // export to our context
    root.Narwhal = Narwhal;

})();
