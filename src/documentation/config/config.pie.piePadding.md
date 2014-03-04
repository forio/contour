#### **piePadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance from the edge of the chart to the [`outerRadius`](#config_config.pie.outerRadius), that is, the amount of whitespace around the pie but within the [`chart`](#config_config.chart).

**Example:**

    new Contour({
        el: '.myPieChart',
        pie: { piePadding: 100 }
    })
    .pie(data)
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.pie.piePadding/)*

<% if(notes) { %><%= notes %><% } %>


