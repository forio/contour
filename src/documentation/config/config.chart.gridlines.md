#### **gridlines** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

Which gridlines to draw on the chart. 

Options for drawing gridlines are:

* `'none'`: no gridlines are drawn (however, axes are drawn)
* `'horizontal'`: horizontal gridlines are drawn
* `'vertical'`: vertical gridlines are drawn
* `'both'`: both horizontal and vertical gridlines are drawn

**Example:**

	new Narwhal({
	    el: ".myChart",
	    chart: { gridlines: 'both' }
	  })
	.cartesian()
	.line(data)
	.render()

**Notes:**

Gridlines are drawn from all visible tick marks. See [`xAxis.firstAndLast`]() and [`yAxis.smartAxis`]() to control which tick marks are visible.

<% if(notes) { %><%= notes %><% } %>

