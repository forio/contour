#### **outerTickSize** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The length of the tick mark at the end of the axis, in pixels, offset from the axis.

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    xAxis: { outerTickSize: 20,
                 innerTickSize: 6, 
                 firstAndLast: false }
	  })
	.cartesian()
	.line(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/Z8NVp/)*

**Notes:**

The tick mark is drawn `outerTickSize` above the axis when [`orient`](#config_config.xAxis.orient) is set to `top`. The tick mark is drawn `outerTickSize` below the axis when [`orient`](#config_config.xAxis.orient) is set to `bottom`.

<% if(notes) { %><%= notes %> <% } %>

