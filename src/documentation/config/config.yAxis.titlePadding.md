#### **titlePadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance to the left of the axis and [`chart.padding.left`](#config_config.chart.padding.left), in pixels, where the axis `title` is drawn.

**Example:**

    new Contour({
        el: '.myLineChart',
        yAxis: { title: 'Value', titlePadding: 40 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

