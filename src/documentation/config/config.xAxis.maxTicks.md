#### **maxTicks** : { integer }

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The maximum number of tick marks to display on the axis.

Where the ticks are placed is determined based on the number and value of elements in the data series. 

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { maxTicks: 4 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

`maxTicks` serves as the upper bound. For example, when [`firstAndLast`](#config_config.xAxis.firstAndLast) is set to `true`, there are two tick marks, even if `maxTicks` is set much higher. 

<% if(notes) { %><%= notes %><% } %>

