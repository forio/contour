#### **nicing** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

Determines whether the end of the range should correspond exactly to a data point, or if the range should be extended.

When `false`, extends the range only to the largest y-value in the data series, and draws a tick mark there.

When `true`, extends the range so that it starts and ends on ["nice, round" values](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-linear_nice), that is, at or above the largest y-value in the data series, and draws a tick mark there. Rounding is done at multiples of 1, 2, 5, 10, or 10x.

**Example:**

    new Contour({
        el: '.myLineChart',
        yAxis: { nicing: false }
      })
    .cartesian()
	//for this data set, 
	//nicing: false draws the top tick mark at 8.2 
	//nicing: true draws the top tick mark at 9    
    .line([0.8, 2, 4, 5, 8.2])
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

The [`smartAxis`](#config_config.yAxis.smartAxis) configuration option has the highest precedence in specifying locations of tick marks. If [`smartAxis`](#config_config.yAxis.smartAxis) is `true`, `nicing` is ignored.

See also: [`smartAxis`](#config_config.yAxis.smartAxis), [`min`](#config_config.yAxis.min), [`max`](#config_config.yAxis.max), [`tickValues`](#config_config.yAxis.tickValues), [`ticks`](#config_config.yAxis.ticks).

<% if(notes) { %><%= notes %><% } %>

