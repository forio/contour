(function () {

    var root = this;

    var defaults = {

        chart: {
            animations: {
                enable: true,
                // duration of the animation in ms
                duration: 400,
            },
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
                bottom: null,
                left: null
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

    // used to pass the last specified dataset
    // to the next visualiaztion in the chain wihtout
    // the need to specify it again.... this allows you to do
    // new Contour().cartesian().line(dataset).lengend().tooltip().render()
    // and legend and tooltip will recieve dataset
    this.lastData;

    /**
    * Creates a Contour instance, based on the core Contour visualizations object. This instance can contain a set of related visualizations.
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
    * @class Contour()
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
    * See a sample in the [Contour Gallery](http://forio.com/contour/gallery.html#/chart/pie/pie-gauge).
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

            data = data || this.lastData || [];
            sortSeries(data);
            vis = new Contour.VisualizationContainer(data, categories, opt, ctorName, renderer, this);
            this._visualizations.push(vis);
            this.lastData = data;
            return this;
        };

        /* expose the renderer function so it can be reused
        * by other visualizations though the constructor function
        * ie. Contour.export('customLineChart', function (data, layer, options) {
        *       // call the line chart directly
        *       return this.line.renderer(data, layer, options);
        *    });
        */
        Contour.prototype[ctorName].renderer = renderer;
    };


    /**
    * Exposes functionality to the core Contour object.
    * Use this to add *functionality* that will be available for any visualizations.
    *
    * ###Example:
    *
    *     Contour.expose('example', function ctor(params) {
    *         // params are the parameters passed into the constructor function
    *         return {
    *             // the init function, if provided, is called automatically upon instantiation of the functionality
    *             // the options parameter has the global Contour options object
    *             init: function (options) { ... },
    *
    *             // when included in the instance, the function `.myFunction` is available in the visualizations
    *             myFunction: function(data) { .... }
    *         };
    *     });
    *
    *     Contour.export('visualizationThatUsesMyFunction', function(data, layer) {
    *           //function body including call to this.myFunction(data)
    *     });
    *
    *     // to include the functionality into a specific instance
    *     new Contour(options)
    *           .example({ text: 'someText' })
    *           .visualizationThatUsesMyFunction()
    *           .render()
    *

    */
    Contour.expose = function (ctorName, functionalityConstructor) {
        var ctor = function () {
            var functionality = functionalityConstructor;
            if (typeof functionalityConstructor === 'function') {
                functionality = Object.create(functionalityConstructor);
                functionality = functionalityConstructor.apply(functionality, arguments);
            }

            // extend the --instance-- we don't want all charts to be overriden...
            _.extend(this, _.omit(functionality, 'init'));

            if(functionality.init) {
                functionality.init.call(this, this.options);
            }

            // keep a list of the included functionality into this instance
            // so we can match and check dependencies
            this._exposed.push(ctorName);

            return this;
        };

        Contour.prototype[ctorName] = ctor;

        return this;
    };

    Contour.prototype = _.extend(Contour.prototype, {
        _visualizations: undefined,

        _extraOptions: undefined,

        _exposed: undefined,

        // Initializes the instance of Contour
        init: function (options) {
            // for now, just  store this options here...
            // the final set of options will be composed before rendering
            // after all components/visualizations have been added
            this.options = options || {};

            this._extraOptions = [];
            this._visualizations = [];
            this._exposed = [];

            return this;
        },

        calculateWidth: function () {

            // assume all in pixel units and border-box box-sizing
            var outerWidth = parseInt(_.nw.getStyle(this.options.el, 'width') || 0, 10);
            var paddingLeft = parseInt(_.nw.getStyle(this.options.el, 'padding-left') || 0, 10);
            var paddingRight = parseInt(_.nw.getStyle(this.options.el, 'padding-right') || 0, 10);

            var width = outerWidth - paddingRight - paddingLeft;

            return this.options.el ? (width || this.options.chart.defaultWidth) : this.options.chart.defaultWidth;
        },

        calculateHeight: function () {
            // assume all in pixel units and border-box box-sizing
            var outerHeight = parseInt(_.nw.getStyle(this.options.el, 'height') || 0, 10);
            var paddingTop = parseInt(_.nw.getStyle(this.options.el, 'padding-top') || 0, 10);
            var paddingBottom = parseInt(_.nw.getStyle(this.options.el, 'padding-bottom') || 0, 10);
            var height = outerHeight - paddingTop - paddingBottom;

            var containerHeight = this.options.el ? height : undefined;
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

            if (this.options.chart.plotWidth <= 0 || this.options.chart.plotHeight <= 0) {
                console.warn('The chart has no space to render. Either the width/height is zero or you have too much padding\nWidth: ' + options.chart.width +
                    '\nHeight: ' + options.chart.height +
                    '\npadding-left: ' + options.chart.padding.left +
                    '\npadding-right: ' + options.chart.padding.right +
                    '\npadding-top: ' + options.chart.padding.top +
                    '\npadding-bottom: ' + options.chart.padding.bottom);

                this.options.chart.plotWidth = this.options.chart.plotWidth < 0 ? 0 : this.options.chart.plotWidth;
                this.options.chart.plotHeight = this.options.chart.plotHeight < 0 ? 0 : this.options.chart.plotHeight;
            }
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
            this.options = _.merge(this.options, _.merge({}, allDefaults, this.options));
        },

        baseRender: function () {
            this.plotArea();

            return this;
        },

        /**
        * Renders this Contour instance and all its visualizations into the DOM.
        *
        * ### Example:
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

        /**
        * Clears this Contour instance and all its visualizations of any size information so that on the next call to render the instace is re-measured.
        * 
        * The function takes two optional arguements width, height -- if given a specific width/height the chart will use that sizing information on the next render.
        * ### Example:
        *
        *     var contour = new Contour({ el:'.myChart' })
        *           .pie([1,2,3])
        *           .render()
        *     
        *     var onResize = function(e) {
        *          contour.resize().render();
        *     }
        *
        *     window.addEventListener('resize', onResize);
        *
        * @function resize
        * @param {Number} width (optional) The new width for the visualizations.  If left blank the width will be calcuated from options.el's parent.
        * @param {Number} height (optional) The new height for the visualizations.  If left blank the height will be calcuated from options.el's parent.
        */
        resize: function(width, height) {
            
            if (this.container)
                this.container.style('height', 0);

            delete this.options.chart.width;
            delete this.options.chart.height;
            delete this.options.chart.plotWidth;
            delete this.options.chart.plotHeight;
            delete this.options.chart.plotLeft;
            delete this.options.chart.plotTop;

            if (width)
                this.options.chart.width = width;

            if (height)
                this.options.chart.height = height;
            return this;
        },

        update: function () {
            this.calcMetrics();
            return this;
        },

        plotArea: function () {

            var chartOpt = this.options.chart;

            this.container = d3.select(this.options.el);
            // fix a flicker im web-kit when animating opacity and the chart is in an iframe
            this.container.attr('style', '-webkit-backface-visibility: hidden; position: relative');

            if(!this.svg) {
                this.svg = this.container
                    .append('svg')
                    .attr('viewBox', '0 0 ' + chartOpt.width + ' ' + chartOpt.height)
                    .attr('preserveAspectRatio', 'xMinYMin')
                    .attr('class', 'contour-chart')
                    .attr('height', chartOpt.height)
                    .append('g')
                        .attr('transform', 'translate(' + chartOpt.margin.left + ',' + chartOpt.margin.top + ')');
            } else {
                this.svg
                    .attr('transform', 'translate(' + chartOpt.margin.left + ',' + chartOpt.margin.top + ')');

                d3.select(this.svg.node().parentNode)
                    .attr('viewBox', '0 0 ' + chartOpt.width + ' ' + chartOpt.height)
                    .attr('height', chartOpt.height);
            }

            return this;
        },

        createVisualizationLayer: function (vis, id) {
            return this.svg.append('g')
                .attr('vis-id', id)
                .attr('vis-type', vis.type);
        },

        renderVisualizations: function () {

            _.each(this._visualizations, function (visualization, index) {
                var id = index + 1;
                var layer = visualization.layer || this.createVisualizationLayer(visualization, id);
                var opt = _.merge({}, this.options, visualization.options);

                layer.attr('transform', 'translate(' + this.options.chart.internalPadding.left + ',' + (this.options.chart.padding.top || 0) + ')');

                visualization.layer = layer;
                visualization.parent = this;
                visualization.render(layer, opt, this);
            }, this);

            return this;
        },

        /**
        * Assert that all the dependencies are in the Contour instance.
        * For example, if a visualization requires Cartesian to be included in the instance,
        * it could call this.checkDependencies('Cartesian'), and the framework would
        * give a helpful error message if Cartesian was not included.
        *
        * @function checkDependencies
        * @param {string|array} list of dependencies (as specified in the instance constructor)
        *
        */
        checkDependencies: function (listOfDependencies) {
            listOfDependencies = _.isArray(listOfDependencies) ? listOfDependencies : [listOfDependencies];
            var _this = this;
            var missing = [];

            _.each(listOfDependencies, function (dep) {
                if (_this._exposed.indexOf(dep) === -1) {
                    missing.push(dep);
                }
            });

            if (missing.length) {
                throw new Error('ERROR: Missing depeendencies in the Contour instance (ej. new Contour({}).cartesian())\n The missing dependencies are: [' + missing.join(', ') + ']\nGo to http://forio.com/contour/documentation.html#key_concepts for more information');
            }
        },

        ensureDefaults: function (options, renderer) {
            if (_.isString(renderer)) {
                renderer = this[renderer].renderer;
            }

            if (renderer.defaults) {
                var defaults = renderer.defaults;
                options = _.defaults(options || {}, defaults);
                this.options = _.defaults(this.options, defaults);
            }
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

        },

        dataNormalizer: _.nw.normalizeSeries,

        isSupportedDataFormat: _.nw.isSupportedDataFormat
    });

    // exports for commonJS and requireJS styles
    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = Contour;
    } else {
        root.Contour = Contour;
        if (typeof define === "function" && define.amd) {
            define("contour", [], function () { return Contour; });
        }
    }

})();
