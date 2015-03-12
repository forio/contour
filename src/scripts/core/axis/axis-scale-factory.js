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
                return new _.nw.TimeScale(data, options);
            }

            if (!options.xAxis.categories && options.xAxis.type === 'linear') {
                return new _.nw.LinearScale(data, options);
            }

            return new _.nw.OrdinalScale(data, options);
        },

        yScaleFactory: function (data, options, domain, which) {
            var map = {
                'log': _.nw.LogYAxis,
                'smart': _.nw.SmartYAxis,
                'linear': _.nw.YAxis,
                'multi-linear': _.nw.MultiScaleYAxis
            };

            if(!options[which].type) 
                options[which].type = 'linear';
            
            if(options[which].type === 'linear' && options[which].smartAxis) 
                options[which].type = 'smart';

            if (options[which].type === 'linear' && options[which].multiScale)
                options[which].type = 'multi-linear';

            if(!map[options[which].type]) 
                throw new Error('Unknown axis type: "' + options[which].type + '"');

            return new map[options[which].type](data, options, domain, which);
        }

    };

    _.nw = _.extend({}, _.nw, helpers);

})();
