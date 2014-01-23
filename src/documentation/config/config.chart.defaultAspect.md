#### **defaultAspect** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The `defaultAspect` determines the height of the container for this Narwhal instance, in pixels, if the `height` is undefined. To determine the height, `defaultAspect` looks at the `width` (or the `defaultWidth`, if `width` is also undefined) and then applies the [golden ratio](http://en.wikipedia.org/wiki/Golden_ratio) (`1.161803398875`).

**Example:**

	new Narwhal({
	    el: ".myChart",
	    chart: { defaultAspect: 1 }
	  })
	.cartesian()
	.line(data)
	.render() 

<% if(notes) { %><%= notes %><% } %>

