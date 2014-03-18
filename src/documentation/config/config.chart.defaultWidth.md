#### **defaultWidth** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

If [`width`](#config_config.chart.width) is undefined, use this `defaultWidth` to determine the width of the container for this Contour instance, in pixels.

**Example:**

    new Contour({
        el: '.myChart',
        chart: { defaultWidth: 250 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

