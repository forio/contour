#### **defaultWidth** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

If `width` is undefined, use this `defaultWidth` to determine the width of the container for this Narwhal instance, in pixels.

**Example:**

	new Narwhal({
	    el: ".myChart",
	    chart: { defaultWidth: 250 }
	  })
	.cartesian()
	.line(data)
	.render()



<% if(notes) { %><%= notes %><% } %>

