#### **bar** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

To override any of the default configuration options in a bar chart, include the `bar` configuration object in the configuration options that you pass to your Narwhal constructor.

**Example:**

	new Narwhal({
	    el: ".myBarChart",
	    bar: {
	      // bar-specific configuration options
	    }
	  })
	.cartesian()
	.horiztonal()
	.bar(data)
	.render()	
	
<% if(notes) { %><%= notes %><% } %>

