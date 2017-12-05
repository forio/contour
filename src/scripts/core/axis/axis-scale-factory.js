import nwt from '../../utils/contour-utils';

nwt.xScaleFactory = function (data, options) {
    // if we have dates in the x field of the data points
    // we need a time scale, otherwise is an oridinal
    // two ways to shape the data for time scale:
    //  [{ x: date, y: 1}, {x: date, y: 2}]
    //  [{ data: [ x: date, y: 1]}, {data: [x: date, y: 100]}]
    // if we get no data, we return an ordinal scale
    var isTimeData = options.xAxis.type === 'time' || (Array.isArray(data) && data.length > 0 && data[0].data ?
        data[0].data[0].x && nwt.isDate(data[0].data[0].x) :
        Array.isArray(data) && data.length > 0 && data[0].x && nwt.isDate(data[0].x));


    if (isTimeData && options.xAxis.type !== 'ordinal') {
        return new nwt.axes.TimeScale(data, options);
    }

    if (!options.xAxis.categories && options.xAxis.type === 'linear') {
        return new nwt.axes.LinearScale(data, options);
    }

    return new nwt.axes.OrdinalScale(data, options);
};

nwt.yScaleFactory = function (data, options, axisType, domain) {
    var map = {
        'log': nwt.axes.LogYAxis,
        'smart': nwt.axes.SmartYAxis,
        'linear': nwt.axes.YAxis,
        'centered': nwt.axes.CenteredYAxis
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
    if (nwt.axes[axisType]) {
        return new nwt.axes[axisType](data, options, domain);
    }

    throw new Error('Unknown axis type: "' + axisType + '"');
};
