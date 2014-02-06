#### **offset** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The horiztonal distance between the start of the range band and the start of the drawn column, in pixels.

**Example:**

		new Narwhal({
			el: '.myColumnChart',
			column: { offset: 15 }
		})

*[Try it.](http://jsfiddle.net/forio/svKGj/)*

**Notes:**

The `offset` is for *all* of the column visualizations in this instance of Narwhal. Therefore, if you add multiple column chart visualizations to your Narwhal instance, mostly likely you will want to override this configuration option *for each subsequent visualization*. 

For example:

	new Narwhal({
	    el: '.myColumnChart'
	    column: { offset: 15 }
	  })
	.cartesian()
	.column(data, { columnWidth: 10 })
	.column(otherData, { columnWidth: 40, offset: 30 })
	.render()


<% if(notes) { %><%= notes %><% } %>

