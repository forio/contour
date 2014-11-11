#### **offset** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The vertical distance between the start of the range band and the start of the drawn bar, in pixels.

**Example:**

		new Contour({
			el: '.myBarChart',
			bar: { offset: 15 }
		})
		.cartesian()
		.horizontal()
		.bar(data)
		.render();

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

The `offset` is for *all* of the bar visualizations in this instance of Contour. Therefore, if you add multiple bar chart visualizations to your Contour instance, mostly likely you will want to override this configuration option *for each subsequent visualization*. 

For example:

    new Contour({
        el: '.myBarChart',
        bar: { offset: 15 }
      })
    .cartesian()
    .horizontal()
    .bar(data, { barWidth: 10 })
    .bar(otherData, { barWidth: 30, offset: 40 })
    .render();


<% if(notes) { %><%= notes %><% } %>



