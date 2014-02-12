#### **rotatedFrame** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

Rotate the frame of the plot by reflecting the axes. The origin (0,0) is moved from the lower left corner of the plot to the upper right corner of the plot. 

**Example:**

	new Narwhal({
	    el: ".myChart",
	    chart: { rotatedFrame: true },
        xAxis: { type: 'linear' },
        yAxis: { smartAxis: false }
	  })
	.cartesian()
	.line(data)
    .tooltip()
	.render()

*[Try it.](http://jsfiddle.net/forio/dGFG7/)*

<% if(notes) { %><%= notes %><% } %>

