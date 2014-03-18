#### **columnWidth** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The width of each column, in pixels.

The default value `this.rangeBand` refers to the width when the axis interval for this Contour instance is evenly divided into bands. (See also [d3's rangeBand()](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBand).)

**Example:**

		new Contour({
		  el: '.myColumnChart',
		  column: { columnWidth: 20 }
		})

*[Try it.](<%= jsFiddleLink %>)*

**Notes:** 

The `columnWidth` is divided evenly among *all* of the column visualizations in this instance of Contour. Therefore, if you add multiple column chart visualizations to your Contour instance, mostly likely you will want to override this configuration option *for each subsequent visualization*. (You'll probably also want to set the [`offset`](#config_config.column.offset), so that columns for the two visualizations don't overlap.)

For example:

	new Contour({
	    el: '.myColumnChart'
	    column: { columnWidth: 20 }
	  })
	.cartesian()
	.column(data)
	.column(otherData, { columnWidth: 40, offset: 30 } )
	.render()

<% if(notes) { %><%= notes %> <% } %>


