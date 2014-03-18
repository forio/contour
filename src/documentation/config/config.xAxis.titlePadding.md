#### **titlePadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance below the axis and [`chart.padding.bottom`](#config_config.chart.padding.bottom), in pixels, where the axis `title` is drawn.

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { title: 'Index', titlePadding: 40 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

