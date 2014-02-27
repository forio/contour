#### **groupPadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The horizontal distance between each data series in the *same* column visualization.

**Example:**

		new Contour({
            el: '.myColumnChart',
            column: { groupPadding: 15 }
          })
        .cartesian()
        .column([
            {name: 'series1', data: [1,2,3,4]},
            {name: 'series2', data: [5,6,7,8]}
          ])
        .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.column.groupPadding/)*

**Notes:**

Use [`columnWidth`](#config_config.column.columnWidth) and [`offset`](#config_config.column.offset) to set the distance between columns in *different* column visualizations.

<% if(notes) { %><%= notes %><% } %>

