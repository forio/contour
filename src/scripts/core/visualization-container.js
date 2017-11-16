(function () {
    var _extent = function (series, field) {
        var maxs = [], mins = [];
        series.forEach(function (d) {
            if(!d.data.length) return;
            var values = d.data.map(function (d) { return d[field]; });
            maxs.push(d3.max(values));
            mins.push(d3.min(values));
        });

        //
        if(!mins.length || !maxs.length) return [];

        return [Math.min.apply(null, mins), Math.max.apply(null, maxs)];
    };


    /*jshint eqnull:true */
    var _stackedExtent = function (data) {
        var stack = _.nw.stackLayout();
        var dataSets = stack(data);
        var ext = [];
        dataSets.forEach(function (set) {
            set.data.forEach(function (d, i) {
                var cur = ext[i] || 0;
                ext[i] = cur + d.y;
            });
        });

        return [Math.min.apply(null, ext), Math.max.apply(null, ext)];
    };

    var _xExtent = _.nw.partialRight(_extent, 'x');
    var _yExtent = _.nw.partialRight(_extent, 'y');

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
                this.xDomain = _.flatten(this.data.map(function (set) { return set.data.map(function (d) { return d.x; }); }));
                this.xExtent = _xExtent(this.data, 'x');
                this.yExtent = options[this.type].stacked ? _stackedExtent(this.data) : _yExtent(this.data);
            }
        }
    };

    Contour.VisualizationContainer = VisInstanceContainer;

})();
