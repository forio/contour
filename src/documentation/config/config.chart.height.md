#### **height** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The height of the container for this Contour instance, in pixels. 

**Example:**

    new Contour({
        el: '.myChart',
        chart: { height: 600 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

If `height` is undefined, [`defaultAspect`](#config_config.chart.defaultAspect) determines the height. However, if `height` is defined, it takes precendence over [`defaultAspect`](#config_config.chart.defaultAspect).

<% if(notes) { %><%= notes %><% } %>

