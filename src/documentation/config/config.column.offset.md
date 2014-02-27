#### **offset** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The horiztonal distance between the start of the range band and the start of the drawn column, in pixels.

**Example:**

		new Contour({
			el: '.myColumnChart',
			column: { offset: 15 }
		})

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.column.offset/)*

**Notes:**

The `offset` is for *all* of the column visualizations in this instance of Contour. Therefore, if you add multiple column chart visualizations to your Contour instance, mostly likely you will want to override this configuration option *for each subsequent visualization*. 

For example:

    new Contour({
        el: '.myColumnChart',
        column: { offset: 15 }
      })
    .cartesian()
    .column([1, 2, 3, 4], { columnWidth: 10 })
    .column([5, 6, 7, 8], { columnWidth: 30, offset: 40 })
    .render()


<% if(notes) { %><%= notes %><% } %>

