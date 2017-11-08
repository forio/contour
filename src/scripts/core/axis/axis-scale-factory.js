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
                return new NwUtils.axes.TimeScale(data, options);
            }

            if (!options.xAxis.categories && options.xAxis.type === 'linear') {
                return new NwUtils.axes.LinearScale(data, options);
            }

            return new NwUtils.axes.OrdinalScale(data, options);
        },

        yScaleFactory: function (data, options, axisType, domain) {
            var map = {
                'log': NwUtils.axes.LogYAxis,
                'smart': NwUtils.axes.SmartYAxis,
                'linear': NwUtils.axes.YAxis,
                'centered': NwUtils.axes.CenteredYAxis
            };

            if (!axisType) {
                axisType = 'linear';
            }

            if (axisType === 'linear' && (options.yAxis.smartAxis || options.yAxis.scaling.type === 'smart')) {
                axisType = 'smart';
            }

            if (axisType === 'linear' && options.yAxis.scaling.type === 'centered') {
                axisType = 'centered';
            }

            if (map[axisType]) {
                return new map[axisType](data, options, domain);
            }

            // try by namespace
            if (NwUtils.axes[axisType]) {
                return new NwUtils.axes[axisType](data, options, domain);
            }

            throw new Error('Unknown axis type: "' + axisType + '"');
        }

    };

    NwUtils = _.extend({}, NwUtils, helpers);

})();
