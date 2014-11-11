#### **barWidth** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The width of each bar, in pixels. 

The default value `this.rangeBand` refers to the width when the axis interval for this Contour instance is evenly divided into bands. (See also [d3's rangeBand()](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBand).)

**Example:**

		new Contour({
		  el: '.myBarChart',
		  bar: { barWidth: 20 }
		})
		.cartesian()
		.horizontal()
		.bar(data)
		.render();

*[Try it.](<%= jsFiddleLink %>)*

**Notes:** 

The `barWidth` is divided evenly among *all* of the bar visualizations in this instance of Contour. Therefore, if you add multiple bar chart visualizations to your Contour instance, mostly likely you will want to override this configuration option *for each subsequent visualization*. (You'll probably also want to set the [`offset`](#config_config.bar.offset), so that bars for the two visualizations don't overlap.)

For example:

	new Contour({
	    el: '.myBarChart'
	    bar: { barWidth: 20 }
	  })
	.cartesian()
	.bar(data)
	.bar(otherData, { barWidth: 40, offset: 30 } )
	.render();

<% if(notes) { %><%= notes %><% } %>

