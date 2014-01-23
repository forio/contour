#### **width** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The width of the container for this Narwhal instance, in pixels. 

**Example:**

	new Narwhal({
	    el: ".myChart",
	    chart: { width: 400 }
	  })
	.cartesian()
	.line(data)
	.render()

**Notes:**

If `width` is undefined, [`defaultWidth`]() determines the width. However, if `width` is defined, it takes precendence over [`defaultWidth`](). 

<% if(notes) { %><%= notes %><% } %>

