(function () {

    var _extent = function (series, axisOptions, field) {
        var maxs = [], mins = [];
        _.each(series, function (d) {
            if(!d.data.length) 
                return;
            
            if (field == 'x' || axisOptions.series == 'all' || axisOptions.series.indexOf(d.name) >= 0) {
                var values = _.pluck(d.data, field);
                maxs.push(d3.max(values));
                mins.push(d3.min(values));
            }
        });

        //
        if(!mins.length || !maxs.length) return [];

        return [_.min(mins), _.max(maxs)];
    };


    /*jshint eqnull:true */
    var _stackedExtent = function (data, axisOptions) {
        var stack = _.nw.stackLayout();
        var dataSets = stack(data);
        var min = {};
        var max = {};
        var ext = [];
        _.each(dataSets, function (set) {
            if (axisOptions.series == 'all' || axisOptions.series.indexOf(set.name) >= 0) {
                _.each(set.data, function (d, i) {
                    var cur = ext[i] || 0;
                    ext[i] = cur + d.y;
                });
            }
        });

        return [_.min(ext), _.max(ext)];
    };

    function VisInstanceContainer(data, categories, options, type, renderer, context) {
        this.type = type;
        this.renderer = renderer;
        this.ctx = context;
        this.categories = categories;

        this.init(data, options);
    }

    VisInstanceContainer.prototype = {

        init: function (data, options) {
            // set the options first and then the data
            this.setOptions(options);
            this.setData(data);
        },

        render: function (layer, options) {
            this.renderer.call(this.ctx, this.data, layer, options);

            return this.ctx;
        },

        setData: function (data) {
            var normalizeData = (this.ctx || {}).dataNormalizer || _.nw.normalizeSeries;
            this.data = normalizeData(data, this.categories);
            this._updateDomain();

            return this.ctx;
        },

        setOptions: function (options) {
            var opt = {};
            opt[this.type] = options || {};
            this.options = {};
            this.options = _.merge({}, (this.renderer || {}).defaults || {}, opt);

            return this.ctx;
        },

        _updateDomain: function () {
            if(!this.options[this.type]) throw new Error('Set the options before calling setData or _updateDomain');

            var isSupportedFormat = (this.ctx || {}).isSupportedDataFormat || _.nw.isSupportedDataFormat;

            if (isSupportedFormat(this.data)) {
                this.xDomain = _.flatten(_.map(this.data, function (set) { return _.pluck(set.data, 'x'); }));
                this.xExtent = _extent(this.data, this.ctx.options.xAxis, 'x');
                this.yExtent = this.options[this.type].stacked ? _stackedExtent(this.data, this.ctx.options.yAxis, 'y') : _extent(this.data, this.ctx.options.yAxis, 'y');
                this.rightYExtent = this.options[this.type].stacked ? _stackedExtent(this.data, this.ctx.options.rightYAxis, 'y') : _extent(this.data, this.ctx.options.rightYAxis, 'y');
            }
        }

    };

    Contour.VisualizationContainer = VisInstanceContainer;

})();
