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
                top: null,
                right: null,
                bottom: 0,
                left: 0
            },
            internalPadding: {
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
    * Creates a Contour instance, based on the core Contour object. This instance can contain a set of related visualizations.
    *
    *   * Pass the constructor any configuration options in the *options* parameter. Make sure the `el` option contains the selector of the container in which the Contour instance will be rendered.
    *   * Set the frame for this Contour instance (e.g. `.cartesian()`).
    *   * Add one or more specific visualizations to this Contour instance (e.g. `.scatter()`, `.trend-line()`). Pass each visualization constructor the data it displays. Pass configuration options if desired.
    *   * Invoke an action for this Contour instance (e.g. `.render()`).
    *
    * ### Example:
    *
    *     new Contour({el: 'myChart'})
    *       .cartesian()
    *       .line([1,3,2,5])
    *       .render()
    *
    *
    * @class Contour() visualizations object
    * @param {object} options The global configuration options object
    *
    */
    function Contour (options) {
        this.init(options);

        return this;
    }

    /**
    * Adds a new kind of visualization to the core Contour object.
    * The *renderer* function is called when you add this visualization to instances of Contour.
    *
    * ### Example:
    *
    *     Contour.export("exampleVisualization", function(data, layer) {
    *           //function body to create exampleVisualization
    *           //for example using SVG and/or D3
    *     });
    *
    *     //to include the visualization into a specific Contour instance
    *     new Contour(options)
    *           .exampleVisualization(data)
    *           .render()
    *
    * @param {String} ctorName Name of the visualization, used as a constructor name.
    * @param {Function} renderer Function called when this visualization is added to a Contour instance. This function receives the data that is passed in to the constructor.
    */
    Contour.export = function (ctorName, renderer) {

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


        Contour.prototype[ctorName] = function (data, options) {
            var categories = this.options ? this.options.xAxis ? this.options.xAxis.categories : undefined : undefined;
            var opt =  _.extend({}, this.options[ctorName], options);
            var vis;

            data = data || [];
            sortSeries(data);
            vis = new Contour.VisualizationContainer(_.nw.normalizeSeries(data, categories), opt, ctorName, renderer, this);
            this._visualizations.push(vis);

            return this;
        };
    };


    /**
    * Exposes functionality to the core Contour object.
    * Use this to add *functionality* that will be available for any visualizations.
    *
    * ###Example:
    *
    *     Contour.expose("example", {
    *          // when included in the instance, the function `.myFunction` is available in the visualizations
    *         myFunction: function(data) { .... }
    *     });
    *
    *     Contour.export("visualizationThatUsesMyFunction", function(data, layer) {
    *           //function body including call to this.myFunction(data)
    *     });
    *
    *     // to include the functionality into a specific instance
    *     new Contour(options)
    *           .example()
    *           .visualizationThatUsesMyFunction()
    *           .render()
    */
    Contour.expose = function (ctorName, functionalityConstructor) {
        var ctor = function () {
            var functionality = typeof functionalityConstructor === 'function' ? new functionalityConstructor() : functionalityConstructor;
            // extend the --instance-- we don't want all charts to be overriden...
            _.extend(this, _.omit(functionality, 'init'));

            if(functionality.init) functionality.init.call(this, this.options);

            return this;
        };

        Contour.prototype[ctorName] = ctor;

        return this;
    };

    Contour.prototype = _.extend(Contour.prototype, {
        _visualizations: undefined,

        _extraOptions: undefined,

        // Initializes the instance of Narwhal
        init: function (options) {
            // for now, just  store this options here...
            // the final set of options will be composed before rendering
            // after all components/visualizations have been added
            this.options = options || {};

            this._extraOptions = [];
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

            return !!containerHeight && containerHeight > 1 ?  containerHeight : Math.round(calcWidth * ratio);
        },

        calcMetrics: function () {
            var options = this.options;

            this.adjustPadding();

            this.adjustTitlePadding();

            options.chart.width = options.chart.width || this.calculateWidth();
            options.chart.height = options.chart.height || this.calculateHeight();

            this.options = _.merge(options, {
                chart: {
                    plotWidth: options.chart.width - options.chart.margin.left - options.chart.margin.right - options.chart.internalPadding.left - options.chart.padding.right,
                    plotHeight: options.chart.height - options.chart.margin.top - options.chart.margin.bottom - options.chart.padding.top - options.chart.internalPadding.bottom,
                    plotLeft: options.chart.margin.left + options.chart.internalPadding.left,
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
            var mergeExtraOptions = function (opt) { _.merge(allDefaults, opt); };
            var mergeDefaults = function (vis) { _.merge(allDefaults, vis.renderer.defaults); };

            _.each(this._extraOptions, mergeExtraOptions);
            _.each(this._visualizations, mergeDefaults);

            // compose the final list of options right before start rendering
            this.options = _.merge({}, allDefaults, this.options);
        },

        baseRender: function () {
            this.plotArea();

            return this;
        },

        /**
        * Renders this Contour instance and all its visualizations into the DOM.
        *
        * Example:
        *
        *     new Contour({ el:'.myChart' })
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
                    .attr('class', 'contour-chart')
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
                .attr('transform', 'translate(' + this.options.chart.internalPadding.left + ',' + this.options.chart.padding.top + ')');
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
        * Sets the same data into all visualizations for a Contour instance. Useful for creating interactive
        * visualizations: call after getting the additional data from the user.
        *
        * ###Example:
        *
        *     var data = [1,2,3,4,5];
        *     var chart = new Contour({ el:'.myChart' })
        *           .cartesian()
        *           .scatter(data)
        *           .trendLine(data);
        *
        *     data.push(10);
        *     chart.setData(data)
        *           .render();
        *
        * @function setData
        *
        */
        setData: function (data) {
            _.invoke(this._visualizations, 'setData', data);

            return this;
        },

        /**
        * Returns a VisualizationContainer object for the visualization at a given index (0-based).
        *
        * ###Example:
        *
        *     var chart = new Contour({ el:'.myChart' })
        *           .pie([1,2,3])
        *           .render()
        *
        *     var myPie = chart.select(0)
        *
        *     // do something with the visualization, for example updating its data set
        *     myPie.setData([6,7,8,9]).render()
        *
        * @function select
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
    root.Contour = Contour;

})();
