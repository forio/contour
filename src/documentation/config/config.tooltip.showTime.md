#### **showTime** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The amount of time, in milliseconds, for the tooltip to appear and reach [`visibileOpacity`]().

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    tooltip: { showTime: 200 }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render() 

**Notes:**

[`animate`]() has precedence over `showTime`. Therefore, if [`animate`]() is `false`, the tooltip appears instantaneously, regardless of the value of `showTime`.

<% if(notes) { %><%= notes %><% } %>

