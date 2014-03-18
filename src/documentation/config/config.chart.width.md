#### **width** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The width of the container for this Contour instance, in pixels. 

**Example:**

    new Contour({
        el: '.myChart',
        chart: { width: 200 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

If `width` is undefined, [`defaultWidth`](#config_config.chart.defaultWidth) determines the width. However, if `width` is defined, it takes precendence over [`defaultWidth`](#config_config.chart.defaultWidth). 

<% if(notes) { %><%= notes %><% } %>

