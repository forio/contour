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


    var _stackedExtent = function (data) {
        var dataSets = _.pluck(data, 'data');
        var maxLength = _.max(_.map(dataSets, function (d) { return d.length; }));
        var stackY = [];

        for (var j=0; j<maxLength; j++) {
            _.each(dataSets, function (set) {
                stackY[j] = set[j] ? (stackY[j] || 0) + set[j].y : (stackY[j] || 0);
            });
        }

        return [_.min(stackY), _.max(stackY)];
    };

    var _xExtent = _.partialRight(_extent, 'x');
    var _yExtent = _.partialRight(_extent, 'y');

    function VisInstanceContainer(data, options, type, renderer) {
        this.data = data;
        this.options = options;
        this.type = type;
        this.renderer = renderer;

        this.init();
    }



    VisInstanceContainer.prototype = {

        init: function () {
            if (_.nw.isSupportedDataFormat(this.data)) {
                this.xDomain = _.flatten(_.map(this.data, function (set) { return _.pluck(set.data, 'x'); }));
                this.xExtent = _xExtent(this.data);
                // this.yExtent = _yExtent(this.data);
                this.yExtent = this.options[this.type].stacked ? _stackedExtent(this.data) : _yExtent(this.data);
            }
        },

        render: function (layer, options, context) {
            this.renderer.call(context, this.data, layer, options);
        },



    };

    Narwhal.VisualizationContainer = VisInstanceContainer;

})();
