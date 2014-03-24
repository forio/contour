#### **enable** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

When `true`, animate the rendering of the chart. Data points rise from the xAxis to their position.

When `false`, render the chart immediately, without animation.

**Example:**

    new Contour({
        el: '.myLineChart',
        chart: { animations : { enable: false } } 
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

`enable` has precendence over [`duration`](#config_config.chart.animations.duration), so if `enable` is set to `false`, there is no animation, regardless of the value for [`duration`](#config_config.chart.animations.duration).

<% if(notes) { %><%= notes %><% } %>

