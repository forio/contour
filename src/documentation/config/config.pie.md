#### **pie** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

To override any of the default configuration options in a pie chart, include the `pie` configuration object in the configuration options that you pass to your Contour constructor.

**Example:**

    new Contour({
	    el: '.myPieChart',
	    pie: {
	      // pie-specific configuration options
	    }
    })
	.pie(data)
	.render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>


