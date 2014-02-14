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
            },
            // automatically false by default anyway; adding here to help generate docs
            rotatedFrame: false,
            // width in pixels of the plot area (area inside the axis if any). This gets calculated on render
            plotWidth: undefined,
            // height in pixels of the plot area (area inside the axis if any). This gets calculated on render
            plotHeight: undefined,
            // top edge in pixels (from the edge of the svg) of the plot area (area inside the axis if any). This gets calculated on render
            plotTop: undefined,
            // left edge in pixels (from the edge of the svg) of the plot area (area inside the axis if any). This gets calculated on render
            plotLeft: undefined,
        },

        xAxis: {
        },

        yAxis: {
        },

        tooltip: {
        }
    };


    /**
    * Create a set of related visualizations by calling the Narwhal visualization constructor. This creates a Narwhal instance, based on the core Narwhal object.
    *
    *   * Pass the constructor any configuration options in the *options* parameter. Make sure the `el` option contains the selector of the container in which the Narwhal instance will be rendered.
    *   * Set the frame for this Narwhal instance (e.g. `.cartesian()`).
    *   * Add one or more specific visualizations to this Narwhal instance (e.g. `.scatter()`, `.trend-line()`). Pass each visualization constructor the data it displays.
    *   * Invoke an action for this Narwhal instance (e.g. `.render()`).
    *
    * ### Example:
    *
    *     new Narwhal({el: 'myChart'})
    *       .cartesian()
    *       .line([1,3,2,5])
    *       .render()
    *
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
    * Adds a new kind of visualization to the core Narwhal object.
    * The *renderer* function is called when you add this visualization to instances of Narwhal.
    *
    * ### Example:
    *
    *     Narwhal.export("exampleVisualization", function(data, layer) {
    *           //function body to create exampleVisualization
    *           //for example using SVG and/or D3
    *     });
    *
    *     //to include the visualization into a specific Narwhal instance
    *     new Narwhal(options)
    *           .exampleVisualization(data)
    *           .render()
    *
    * @param {String} ctorName Name of the visualization, used as a constructor name.
    * @param {Function} renderer Function called when this visualization is added to a Narwhal instance. This function receives the data that is passed in to the constructor.
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
            var categories = this.options ? this.options.xAxis ? this.options.xAxis.categories : undefined : undefined;
            var opt =  _.extend({}, this.options[ctorName], options);
            var vis;

            data = data || [];
            sortSeries(data);
            vis = new Narwhal.VisualizationContainer(_.nw.normalizeSeries(data, categories), opt, ctorName, renderer, this);
            this._visualizations.push(vis);

            return this;
        };
    };


    /**
    * Exposes functionality to the core Narwhal object.
    * Use this to add *functionality* that will be available for any visualizations.
    *
    * ###Example:
    *
    *     Narwhal.expose("example", {
    *          // when included in the instance, the function `.myFunction` is available in the visualizations
    *         myFunction: function(data) { .... }
    *     });
    *
    *     Narwhal.export("visualizationThatUsesMyFunction", function(data, layer) {
    *           //function body including call to this.myFunction(data)
    *     });
    *
    *     // to include the functionality into a specific instance
    *     new Narwhal(options)
    *           .example()
    *           .visualizationThatUsesMyFunction()
    *           .render()
    */
    Narwhal.expose = function (ctorName, functionalityConstructor) {
        var ctor = function () {
            var functionality = typeof functionalityConstructor === 'function' ? new functionalityConstructor() : functionalityConstructor;
            // extend the --instance-- we don't want all charts to be overriden...
            _.extend(this, _.omit(functionality, 'init'));

            if(functionality.init) functionality.init.call(this, this.options);

            return this;
        };

        Narwhal.prototype[ctorName] = ctor;

        return this;
    };

    Narwhal.prototype = _.extend(Narwhal.prototype, {
        _visualizations: undefined,

        // Initializes the instance of Narwhal
        init: function (options) {
            // for now, just  store this options here...
            // the final set of options will be composed before rendering
            // after all components/visualizations have been added
            this.options = options || {};

            this._visualizations = [];

            return this;
        },

        calculateWidth: function () {
            var width = _.nw.getStyle(this.options.el, 'width');
            return this.options.el ? (parseInt(width, 10) || this.options.chart.defaultWidth) : this.options.chart.defaultWidth;
        },

        calculateHeight: function () {
            var height = _.nw.getStyle(this.options.el, 'height');
            var containerHeight = this.options.el ? parseInt(height, 10) : undefined;
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

            this.options = _.merge(options, {
                chart: {
                    plotWidth: options.chart.width - options.chart.margin.left - options.chart.margin.right - options.chart.padding.left - options.chart.padding.right,
                    plotHeight: options.chart.height - options.chart.margin.top - options.chart.margin.bottom - options.chart.padding.top - options.chart.padding.bottom,
                    plotLeft: options.chart.margin.left + options.chart.padding.left,
                    plotTop: options.chart.margin.top + options.chart.padding.top
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
            var allDefaults = _.merge({}, defaults);
            var mergeDefaults = function (vis) { _.merge(allDefaults, vis.renderer.defaults); };

            _.each(this._visualizations, mergeDefaults);

            // compose the final list of options right before start rendering
            this.options = _.merge({}, allDefaults, this.options);
        },

        baseRender: function () {
            this.plotArea();

            return this;
        },

        /**
        * Renders this Narwhal instance and all its visualizations into the DOM.
        *
        * Example:
        *
        *     new Narwhal({ el:'.myChart' })
        *           .pie([1,2,3])
        *           .render()
        *
        * @function render
        *
        */
        render: function () {
            this.composeOptions();

            this.calcMetrics();

            this.baseRender();

            this.renderVisualizations();

            return this;
        },

        update: function () {
            this.calcMetrics();
            return this;
        },

        plotArea: function () {

            var chartOpt = this.options.chart;

            this.container = d3.select(this.options.el);

            if(!this.svg) {
                this.svg = this.container
                    .append('svg')
                    .attr('viewBox', '0 0 ' + chartOpt.width + ' ' + chartOpt.height)
                    .attr('preserveAspectRatio', 'xMinYMin')
                    .attr('class', 'narwhal-chart')
                    .attr('height', chartOpt.height)
                    .append('g')
                        .attr('transform', 'translate(' + chartOpt.margin.left + ',' + chartOpt.margin.top + ')');
            }

            return this;
        },

        createVisualizationLayer: function (vis, id) {
            return this.svg.append('g')
                .attr('vis-id', id)
                .attr('vis-type', vis.type)
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + this.options.chart.padding.top + ')');
        },

        renderVisualizations: function () {

            _.each(this._visualizations, function (visualization, index) {
                var id = index + 1;
                var layer = visualization.layer || this.createVisualizationLayer(visualization, id);
                var opt = _.merge({}, this.options, visualization.options);
                visualization.layer = layer;
                visualization.parent = this;
                visualization.render(layer, opt, this);
            }, this);

            return this;
        },

        /**
        * Set's the same data set into all visualizations for an instance
        *
        * Example:
        *
        *     var data = [1,2,3,4,5];
        *     var chart = new Narwhal({ el:'.myChart' })
        *           .scatter(data)
        *           .trendLine(data);
        *
        *     data.push(10);
        *     chart.setData(data)
        *           .render();
        *
        * @function .setData
        *
        */
        setData: function (data) {
            _.invoke(this._visualizations, 'setData', data);

            return this;
        },

        /**
        * Returns a VisualizationContainer object for the visualization at a given index (0-based)
        *
        * Example:
        *
        *     var chart = new Narwhal({ el:'.myChart' })
        *           .pie([1,2,3])
        *           .render()
        *
        *     var myPie = chart.select(0)
        *
        *     // do something with the visualization like updateing its data set
        *     myPie.setData([6,7,8,9]).render()
        *
        * @function .select
        *
        */
        select: function (index) {
            return this._visualizations[index];
        },

        // place holder function for now
        data: function () {

        }
    });


    // export to our context
    root.Narwhal = Narwhal;

})();
