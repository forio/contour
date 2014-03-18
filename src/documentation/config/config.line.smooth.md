#### **smooth** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

When `false`, the line segments between data points are straight.

When `true`, the segments between data points are [interpolated in a cardinal spline](http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline){:target="_blank"}.

**Example:**

    new Contour({
        el: '.myLineChart',
        line: { smooth: true }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

