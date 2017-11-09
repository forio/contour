(function () {
    var _extent = function (series, field) {
        var maxs = [], mins = [];
        _.each(series, function (d) {
            if(!d.data.length) return;
            var values = _.map(d.data, field);
            maxs.push(d3.max(values));
            mins.push(d3.min(values));
        });

        //
        if(!mins.length || !maxs.length) return [];

        return [_.min(mins), _.max(maxs)];
    };


    /*jshint eqnull:true */
    var _stackedExtent = function (data) {
        var stack = _.nw.stackLayout();
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

    function VisInstanceContainer(data, vizOptions, type, renderer, context) {
        this.type = type;
        this.renderer = renderer;
        this.ctx = context;
        this.options = vizOptions;
        this.init(data);
    }

    VisInstanceContainer.prototype = {
        init: function (data) {
           this.rawData = data;
       },

       render: function (layer, options, ctx) {
           this.renderer.call(ctx, this.data, layer, options);
           return ctx;
       },

       setVisibility: function (visible) {
            var node = this.layer.node();

            if (visible) {
                node.style.display = 'block';
            } else {
                node.style.display = 'none';
            }

            return this.ctx;
        },

        setData: function (data) {
            this.rawData = data;
            return this.ctx;
        },


        normalizeData: function (options) {
            var normal = (this.ctx || {}).dataNormalizer || _.nw.normalizeSeries;
            var categories = (options.xAxis || {}).categories;
            this.data = normal(this.rawData, categories);
            this._updateDomain(options);

            return this.ctx;
        },

        _updateDomain: function (options) {
            if(!options[this.type]) throw new Error('Set the options before calling setData or _updateDomain');

            var isSupportedFormat = (this.ctx || {}).isSupportedDataFormat || _.nw.isSupportedDataFormat;

            if (isSupportedFormat(this.data)) {
                this.xDomain = _.flatten(_.map(this.data, function (set) { return _.map(set.data, 'x'); }));
                this.xExtent = _xExtent(this.data, 'x');
                this.yExtent = options[this.type].stacked ? _stackedExtent(this.data) : _yExtent(this.data);
            }
        }
    };

    Contour.VisualizationContainer = VisInstanceContainer;

})();
