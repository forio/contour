#### **smartAxis** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

When `smartAxis` is `true`, tick marks are drawn for:

* the minimum value of the axis (defaults to 0, but can be specified with [`min`](#config_config.yAxis.min))
* the maximum value of the axis (either the largest y-value, or the largest y-value rounded up, based on [`nicing`](#config_config.yAxis.nicing), or as specified based on [`max`](#config_config.yAxis.max))
* the y-value of the data point with the largest y-value (but only if [`max`](#config_config.yAxis.max) is not specified) 

When `smartAxis` is `false`, tick marks are drawn for:

* the minimum value of the axis (defaults to 0, but can be specified with [`min`](#config_config.yAxis.min))
* the y-values specified in the [`tickValues`](#config_config.yAxis.tickValues) array, if defined
* approximately [`ticks`](#config_config.yAxis.ticks) number of tick marks evenly distributed along the axis, if defined
* y-values at multiples of 1, 2, 5, 10, or 10x, if neither [`tickValues`](#config_config.yAxis.tickValues) nor [`ticks`](#config_config.yAxis.ticks) is defined

**Example:**

    new Contour({
        el: '.myLineChart',
        yAxis: { smartAxis: true }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

The `smartAxis` configuration option has the highest precedence in specifying locations of tick marks. If `smartAxis` is `true`, both [`tickValues`](#config_config.yAxis.tickValues) and [`ticks`](#config_config.yAxis.ticks) options are ignored.

To remove the tick mark at the end of the range, set [`outerTickSize`](#config_config.yAxis.outerTickSize) to `0`.

See also: [`min`](#config_config.yAxis.min), [`max`](#config_config.yAxis.max), [`nicing`](#config_config.yAxis.nicing), [`tickValues`](#config_config.yAxis.tickValues), [`ticks`](#config_config.yAxis.ticks).

<% if(notes) { %><%= notes %><% } %>

