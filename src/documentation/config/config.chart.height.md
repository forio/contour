#### **height** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The height of the container for this Narwhal instance, in pixels. 

**Example:**

	new Narwhal({
	    el: ".myChart",
	    chart: { height: 600 }
	  })
	.cartesian()
	.line(data)
	.render()

**Notes:**

If `height` is undefined, [`defaultAspect`]() determines the height. However, if `height` is defined, it takes precendence over [`defaultAspect`]().

<% if(notes) { %><%= notes %><% } %>

