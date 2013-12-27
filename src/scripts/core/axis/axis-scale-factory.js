(function () {

    var helpers = {
        xScaleFactory: function (data, options) {
            // if we have dates in the x field of the data points
            // we need a time scale, otherwise is an oridinal
            // two ways to shape the data for time scale:
            //  [{ x: date, y: 1}, {x: date, y: 2}]
            //  [{ data: [ x: date, y: 1]}, {data: [x: date, y: 100]}]
            // if we get no data, we return an ordinal scale
            var isTimeData = _.isArray(data) && data.length > 0 && data[0].data ?
                data[0].data[0].x && _.isDate(data[0].data[0].x) :
                _.isArray(data) && data.length > 0 && data[0].x && _.isDate(data[0].x);


            if (isTimeData && options.xAxis.type !== 'ordinal') {
                return new _.nw.TimeScale(data, options);
            }

            if (!options.xAxis.categories && options.xAxis.type === 'linear') {
                return new _.nw.LinearScale(data, options);
            }

            return new _.nw.OrdinalScale(data, options);
        },

        yScaleFactory: function (data, options, yMin, yMax) {
            var map = {
                'log': _.nw.LogYAxis,
                'smart': _.nw.SmartYAxis,
                'linear': _.nw.YAxis
            };

            if(!options.yAxis.type) options.yAxis.type = 'linear';
            if(options.yAxis.type === 'linear' && options.yAxis.smartAxis) options.yAxis.type = 'smart';

            if(!map[options.yAxis.type]) throw new Error('Unknown axis type: "' + options.yAxis.type + '"');

            return new map[options.yAxis.type](data, options, yMin, yMax);
        }

    };

    _.nw = _.extend({}, _.nw, helpers);

})();
