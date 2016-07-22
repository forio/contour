(function () {

    var helpers = {
        xScaleFactory: function (data, options) {
            // if we have dates in the x field of the data points
            // we need a time scale, otherwise is an oridinal
            // two ways to shape the data for time scale:
            //  [{ x: date, y: 1}, {x: date, y: 2}]
            //  [{ data: [ x: date, y: 1]}, {data: [x: date, y: 100]}]
            // if we get no data, we return an ordinal scale
            var isTimeData = options.xAxis.type === 'time' || (_.isArray(data) && data.length > 0 && data[0].data ?
                data[0].data[0].x && _.isDate(data[0].data[0].x) :
                _.isArray(data) && data.length > 0 && data[0].x && _.isDate(data[0].x));


            if (isTimeData && options.xAxis.type !== 'ordinal') {
                return new nw.axes.TimeScale(data, options);
            }

            if (!options.xAxis.categories && options.xAxis.type === 'linear') {
                return new nw.axes.LinearScale(data, options);
            }

            return new nw.axes.OrdinalScale(data, options);
        },

        yScaleFactory: function (data, options, axisType, domain) {
            var map = {
                'log': nw.axes.LogYAxis,
                'smart': nw.axes.SmartYAxis,
                'linear': nw.axes.YAxis
            };

            if (!axisType) {
                axisType = 'linear';
            }

            if (axisType === 'linear' && options.yAxis.smartAxis) {
                axisType = 'smart';
            }

            if (map[axisType]) {
                return new map[axisType](data, options, domain);
            }

            // try by namespace
            if (nw.axes[axisType]) {
                return new nw.axes[axisType](data, options, domain);
            }

            throw new Error('Unknown axis type: "' + axisType + '"');
        }

    };

    nw = _.extend({}, nw, helpers);

})();
