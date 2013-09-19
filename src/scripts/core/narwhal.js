(function (ns, d3, _, $, undefined) {

    var defaults = {
        chart: {
            width: '100%',      // by default take the size of the parent container
            height: undefined,  // if defined, height takes precedence over aspect
            aspect: 1.61,       // height = width / 1.61
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
            },
        }
    };

    function Narwhal(options) {
        this.init(options);
        return this;
    }

    Narwhal.prototype = _.extend(Narwhal.prototype, {

        init: function (options) {
            this.options = $.extend(true, {}, defaults, options);

            return this;
        },

        calcMetrics: function () {
            var options = this.options;

            this.options = $.extend(true, options, {
                plotWidth: options.chart.width - options.chart.margin.left - options.chart.margin.right - options.chart.padding.left - options.chart.padding.right,
                plotHeight: options.chart.height - options.chart.margin.top - options.chart.margin.bottom - options.chart.padding.top - options.chart.padding.bottom
            });
        },

        plotArea: function () {
            this.calcMetrics();

            var chartOpt = this.options.chart;

            this.container = d3.select(this.options.el);
            this.svg = this.container
                .append('svg')
                    .attr('width', chartOpt.width)
                    .attr('height', chartOpt.height)
                .append('g')
                    .attr('transform', 'translate(' + chartOpt.margin.left + ',' + chartOpt.margin.top + ')');

            return this;
        },

        render: function () {
            this.plotArea();

            return this;
        },

        expose: function (ctorName, functionality) {
            var ctorObj = {};
            var ctor = _.bind(function () {
                // extend the --instance-- we don't want all charts to be overriten...
                _.extend(this, functionality);
            }, this);

            ctorObj[ctorName] = ctor;

            _.extend(this, ctorObj);

            return this;
        }

    });

    window[ns] = Narwhal;

})('Narwhal', window.d3, window._, window.jQuery);
