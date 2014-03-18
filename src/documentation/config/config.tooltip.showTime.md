#### **showTime** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The amount of time, in milliseconds, for the tooltip to appear and reach [`opacity`](#config_config.tooltip.opacity).

**Example:**

    new Contour({
	    el: '.myLineChart',
	    tooltip: { showTime: 1000 }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render() 

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

[`animate`](#config_config.tooltip.animate) has precedence over `showTime`. Therefore, if [`animate`](#config_config.tooltip.animate) is `false`, the tooltip appears instantaneously, regardless of the value of `showTime`.

<% if(notes) { %><%= notes %><% } %>

