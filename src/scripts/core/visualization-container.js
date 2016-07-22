(function () {

    var _extent = function (series, field) {
        var maxs = [], mins = [];
        _.each(series, function (d) {
            if(!d.data.length) return;
            var values = _.pluck(d.data, field);
            maxs.push(d3.max(values));
            mins.push(d3.min(values));
        });

        //
        if(!mins.length || !maxs.length) return [];

        return [_.min(mins), _.max(maxs)];
    };


    /*jshint eqnull:true */
    var _stackedExtent = function (data) {
        var stack = nw.stackLayout();
        var dataSets = stack(data);
        var ext = [];
        _.each(dataSets, function (set) {
            _.each(set.data, function (d, i) {
                var cur = ext[i] || 0;
                ext[i] = cur + d.y;
            });
        });

        return [_.min(ext), _.max(ext)];
    };

    var _xExtent = _.partialRight(_extent, 'x');
    var _yExtent = _.partialRight(_extent, 'y');

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
            var normalizeData = (this.ctx || {}).dataNormalizer || nw.normalizeSeries;
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

            var isSupportedFormat = (this.ctx || {}).isSupportedDataFormat || nw.isSupportedDataFormat;

            if (isSupportedFormat(this.data)) {
                this.xDomain = _.flatten(_.map(this.data, function (set) { return _.pluck(set.data, 'x'); }));
                this.xExtent = _xExtent(this.data, 'x');
                this.yExtent = this.options[this.type].stacked ? _stackedExtent(this.data) : _yExtent(this.data);
            }
        }

    };

    Contour.VisualizationContainer = VisInstanceContainer;

})();
