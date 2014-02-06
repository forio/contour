#### **tickPadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance between the end of the tick mark (which is offset `innerTickSize` from the axis) and the label of the tick mark, in pixels. 

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    yAxis: { tickPadding: 20,
	    		 smartAxis: false }
	  })
	.cartesian()
	.line(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/Ws4Vm/)*

**Notes:**

The label of the tick mark appears to the left of the end of the tick mark when [`orient`](#config_config.yAxis.orient) is set to `left`. The label of the tick mark appears to the right of the end of the tick mark when [`orient`](#config_config.yAxis.orient) is set to `right`.

<% if(notes) { %><%= notes %><% } %>

