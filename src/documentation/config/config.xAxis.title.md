#### **title** : { string }

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The title to display for this axis. 

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { title: 'Index' }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

[`titlePadding`](#config_config.xAxis.titlePadding) determines the distance below the axis and [`chart.padding.bottom`](#config_config.chart.padding.bottom), in pixels, where the axis `title` is drawn. 

<% if(notes) { %><%= notes %><% } %>

