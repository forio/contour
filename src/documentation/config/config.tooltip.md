#### **tooltip** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

To override any of the default configuration options in a tooltip, include the `tooltip` configuration object in the configuration options that you pass to your Contour constructor. 

A tooltip only appears if there is already another visualization added this Contour instance. 

**Example:**

	new Contour({
	    el: '.myLineChart',
	    tooltip: {
	      // tooltip-specific configuration options
	    }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render() 

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

