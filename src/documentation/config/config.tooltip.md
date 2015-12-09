#### **tooltip** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

To override any of the default configuration options in a tooltip, include the `tooltip` configuration object in the configuration options that you pass to your Contour constructor. 

A tooltip only appears if there is already another visualization added this Contour instance. Additionally, each Contour instance can only include one `tooltip` visualization.

**Example:**

	new Contour({
	    el: '.myLineChart',
	    tooltip: {
	      // tooltip-specific configuration options
	    }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render(); 

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

When working with charts with multiple data series, both the series name and series index are available to the tooltip. See the [`tooltip.formatter`](#config_config.tooltip.formatter).

<% if(notes) { %><%= notes %><% } %>

