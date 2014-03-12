#### **type** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

How the xAxis should be scaled. The available options are:

* `ordinal`: The axis is treated as a discrete domain, that is, data points are considered as categories or equal elements of a set. They are spaced evenly across the axis, regardless of their value. For example, 20, 40, and 50 are all the same distance apart.
* `linear`: The axis is treated as a continuous domain, that is, data points are considered as numerical values. They are spaced across the axis based on their value. For example, 20 and 40 are twice as far apart as 40 and 50.
* `time`: The axis is treated as a continuous (linear) domain, but along dates rather than along real numbers. For example, 1/1/2014 and 1/20/2014 are twice as far apart as 1/20/2014 and 1/30/2014. (However, you can force a `time` axis to be treated as ordinal, see [`linearDomain`](#config_config.xAxis.linearDomain).)

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { type: 'ordinal' }
      })
    .cartesian()
    .line([{x:0, y:5}, {x:1, y:3}, {x:3, y:7}, {x:10, y:4}])
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.xAxis.type/)*

**Notes:**

The `type` defaults to `ordinal` **unless** your data is in the JavaScript [Date](http://www.w3schools.com/jsref/jsref_obj_date.asp) format, in which case the `type` defaults to `time`. Either way, you can set the `type` explicitly if needed.


<% if(notes) { %><%= notes %><% } %>

