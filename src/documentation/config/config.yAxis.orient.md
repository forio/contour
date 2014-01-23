#### **orient** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The orientation of the axis and its tick marks.

The supported orientations are:

* `left`: vertical axis with ticks to the left of the axis
* `right`: vertical axis with ticks to the right of the axis

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    yAxis: { orient: "right" }
	  })
	.cartesian()
	.line(data)
	.render()

<% if(notes) { %><%= notes %><% } %>

