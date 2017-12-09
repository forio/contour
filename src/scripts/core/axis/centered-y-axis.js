import nwt from '../../utils/contour-utils';
import d3 from 'd3';
import YAxis from './y-axis';

// focus on vertically centering data - zero anchor is ignored
function CenteredYAxis(data, options, domain) {
    this.data = data;
    this.options = options;
    this.yMax = domain[0];
    this.yMin = domain[1];
    this.NUM_DECIMALS = 1;
}

const __super = YAxis.prototype;
CenteredYAxis.prototype = Object.assign({}, __super, {
    axis: function () {
        var options = this.options.yAxis;
        this.domain = this._scale.domain();
        var numTicks = options.ticks || 5;
        var axis = __super.axis.call(this);
        var tickValues = this._extractYTickValues(options.min, options.max, numTicks);

        return axis.ticks(numTicks)
            .tickValues(tickValues)
            .tickFormat(undefined);
    },

    setDomain: function (domain) {
        var scaledDomain = this._getScaledDomain(domain);

        this.yMin = scaledDomain[0];
        this.yMax = scaledDomain[1];
        this._scale.domain(scaledDomain);
    },

    _getScaledDomain: function(domain) {
        var extent = d3.extent(domain);
        var dataRange = extent[1] - extent[0];
        var domainPadding = dataRange * 0.1;

        var scaledMin = d3.round(extent[0] - domainPadding, this.NUM_DECIMALS);
        var scaledMax = d3.round(extent[1] + domainPadding, this.NUM_DECIMALS);

        return [scaledMin, scaledMax];
    },

        _extractYTickValues:  function(min, max, numTicks) {
        var tickMin = min != null ? min : this.yMin;
        var tickMax = max != null ? max : this.yMax;

        var tickRange = tickMax - tickMin;
        var tickSpacing = tickRange / numTicks;

        var currentTick = tickMin;
        var tickValues = [tickMin];
        while (currentTick < tickMax) {
            currentTick += tickSpacing;
            tickValues.push(d3.round(currentTick, this.NUM_DECIMALS));
        }
        tickValues.push(tickMax);

        return tickValues;
    }
});

export default CenteredYAxis;
