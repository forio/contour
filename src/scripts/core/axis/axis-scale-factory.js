import nwt from '../../utils/contour-utils';
import YAxis from  './y-axis';
import CenteredYAxis from './centered-y-axis';
import LinearScale from './linear-scale-axis';
import LogYAxis from './log-y-axis';
import OrdinalScale from './ordinal-scale-axis';
import SmartYAxis from './smart-y-axis';
import TimeScale from './time-scale-axis';


export const axes = {};
export const addAxis = (name, axisCtor) => {
    axes[name] = axisCtor;
};

export const xScaleFactory = function (data, options) {
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
        return new TimeScale(data, options);
    }

    if (!options.xAxis.categories && options.xAxis.type === 'linear') {
        return new LinearScale(data, options);
    }

    return new OrdinalScale(data, options);
};

export const yScaleFactory = function (data, options, axisType, domain) {
    var map = {
        'log': LogYAxis,
        'smart': SmartYAxis,
        'linear': YAxis,
        'centered': CenteredYAxis
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
    if (axisType in axes) {
        return new axes[axisType](data, options, domain);
    }

    throw new Error('Unknown axis type: "' + axisType + '"');
};
