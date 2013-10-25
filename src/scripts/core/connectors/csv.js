(function (ns, d3, _, $, undefined) {

    function Csv(raw, headerRow) {
        headerRow = typeof headerRow === 'undefined' ? true : headerRow;
        this.parse(raw, headerRow);

        this._dimension = 0;

        return this;
    }

    Csv.prototype = {
        parse: function (raw, headerRow) {
            this._data = [];
            this._headers = [];
            if (!raw || !raw.length) return ;
            var rows = raw.split(/\n\r?/);
            this._headers = headerRow ? _.each(rows.shift().split(','), function(d) { return d.toLowerCase(); }) : _.range(0, rows[0].length);
            _.each(rows, function (r) {
                this._data.push(r.split(','));
            }, this);
        },

        dimension: function (_) {
            if(!arguments.length) return this._headers[this._dimension];
            this._dimension = this._headers.indexOf(_.toLowerCase());
            return this;
        },

        measure: function (_) {
            return this.data(_.toLowerCase());
        },

        data: function (measure) {
            var dimIndex = this._dimension;
            var measureIndex = this._headers.indexOf(measure);
            var result = _.map(this._data, function (d) {
                return {
                    x: d[dimIndex],
                    y: _.isNaN(+d[measureIndex]) ? d[measureIndex] : +d[measureIndex]
                };
            });

            return result;
        }
    };

    Narwhal.connectors = Narwhal.connectors || {};
    Narwhal.connectors.Csv = Csv;

})('Narwhal', window.d3, window._, window.jQuery);
