#### **formatter** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

A function that formats each value. The function should return a string which is a valid [format](#config_config.xAxis.labels.format). (The returned string can vary based on each value.)

The general form of a specifier is `[​[fill]align][sign][symbol][0][width][,][.precision][type]`. The exact definitions are identical to those [used in D3](https://github.com/mbostock/d3/wiki/Formatting#wiki-d3_format).

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { 
            labels : 
                { formatter: 
                    function (datum) { '$' + datum }
                }
        },
        yAxis: {min: 10, max: 30}
      })
    .cartesian()
    .line([{x:25.4, y:15}, {x:31.2, y:20}, {x:37, y:18}, {x:18, y:25}])
    .tooltip()
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

