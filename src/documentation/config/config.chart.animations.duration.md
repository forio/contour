#### **duration** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The length of time, in milliseconds, required for the animation to completely render the chart. 

**Example:**

    new Contour({
        el: '.myLineChart',
        chart: { animations : { enable: true, duration: 2000 } } 
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

[`enable`](#config_config.chart.animations.enable) has precendence over `duration`, so if [`enable`](#config_config.chart.animations.enable) is set to `false`, there is no animation, regardless of the value for `duration`.

<% if(notes) { %><%= notes %><% } %>

