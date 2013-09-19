(function (ns, d3, _, $, undefined) {

    var defaults = {
        chart: {
            width: 400,
            height: 280,
            /* margin between the container and the chart */
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            /* padding between the chart area and the plot area */
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
        },
        title: {
            height: 0,
            text: ''
        }
    };

    function Narwhal(options) {
        this.init(options);
        return this;
    }

    Narwhal.prototype = _.extend(Narwhal.prototype, {

        init: function (options) {
            options = $.extend(true, {}, defaults, options);

            this.options = _.extend(options, {
                plotWidth: options.chart.width - options.chart.margin.left - options.chart.margin.right - options.chart.padding.left - options.chart.padding.right,
                plotHeight: options.chart.height - options.chart.margin.top - options.chart.margin.bottom - options.chart.padding.top - options.chart.padding.bottom
            });

            return this;
        },

        plotArea: function () {
            this.container = d3.select(this.options.el);
            this.svg = this.container
                .append('svg')
                    .attr('width', options.plotWidth)
                    .attr('height', options.plotHeight);

            return this;
        },

        render: function () {
            this.plotArea();

            return this;
        }

    });

    window[ns] = Narwhal;

})('Narwhal', window.d3, window._, window.jQuery);
