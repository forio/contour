(function (ns, d3, _, $, undefined) {

    var defaults = {
        chart: {
            animations: true,
            defaultWidth: 400,      // by default take the size of the parent container
            defaultAspect: 1 / 1.61803398875,       // height = width * ratio
            width: undefined, // calculated at render time based on the options & container
            height: undefined,  // if defined, height takes precedence over aspect
            /* margin between the container and the chart (ie labels or axis title) */
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            /* padding between the chart area and the inner plot area */
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        }
    };

    function Narwhal(options) {
        this.init(options);
        return this;
    }

    Narwhal.export = function (ctorName, renderer) {

        if (typeof renderer !== 'function') throw new Error('Invalid render function for ' + ctorName + ' visualization');

        function normalizeSeries(data) {
            if(!data || !data.length) return data;

            if(data[0].data) {
                return _.map(data, _.bind(function (series, index) {
                    return {
                        name: series.name || 's' + index,
                        data: _.map(series.data, _.bind(this.datum, this))
                    };
                }, this));
            }

            return  _.map(data, _.bind(this.datum, this));
        }

        Narwhal.prototype[ctorName] = function (data, options) {
            data = data || [];
            renderer.defaults = renderer.defaults || {};
            var opt = {};
            opt[ctorName] = options;
            $.extend(true, this.options, renderer.defaults, opt);

            var renderFunc;
            if (_.isArray(data)) {
                this.data(data);
                var datums = normalizeSeries.call(this, data);
                renderFunc = _.partial(renderer, datums);
            } else {
                renderFunc = _.partial(renderer, data);
            }

            this.visualizations.push(renderFunc);

            return this;
        };
    };

    Narwhal.utils = {
        // measure text inside a narwhal chart container
        textBounds: function (text, css) {
            var body = document.getElementsByTagName('body')[0];
            var wrapper = document.createElement('span');
            var dummy = document.createElement('span');
            wrapper.className = 'narwhal-chart';
            dummy.style.position = 'absolute';
            dummy.style.left =  -9999;
            dummy.innerHTML = text;
            dummy.className = css;
            wrapper.appendChild(dummy);
            body.appendChild(wrapper);
            var res = { width: dummy.clientWidth, height: dummy.clientHeight };
            dummy.remove();
            wrapper.remove();
            return res;
        }
    };

    Narwhal.prototype = _.extend(Narwhal.prototype, {

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

            options.chart.width = options.chart.width || this.calculateWidth();
            options.chart.height = options.chart.height || this.calculateHeight();

            this.options = $.extend(true, options, {
                chart: {
                    plotWidth: options.chart.width - options.chart.margin.left - options.chart.margin.right - options.chart.padding.left - options.chart.padding.right,
                    plotHeight: options.chart.height - options.chart.margin.top - options.chart.margin.bottom - options.chart.padding.top - options.chart.padding.bottom
                }
            });
        },

        composeOptions: function () {
            // compise the final list of options right before start rendering
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

            this.svg = this.container
                .append('svg')
                    .attr('viewBox', '0 0 ' + chartOpt.width + ' ' + chartOpt.height)
                    .attr('preserveAspectRatio', 'xMinYMin')
                    .attr('class', 'narwhal-chart')
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

        expose: function (ctorName, functionality) {
            var ctorObj = {};
            var ctor = function () {
                // extend the --instance-- we don't want all charts to be overriten...
                _.extend(this, _.omit(functionality, 'init'));

                if(functionality.init) functionality.init.call(this, this.options);

                return this;
            };

            ctorObj[ctorName] = ctor;

            _.extend(this, ctorObj);

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

    window[ns] = Narwhal;

})('Narwhal', window.d3, window._, window.jQuery);
