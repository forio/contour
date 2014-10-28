#### **stacked** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

Whether a single line chart visualization that has data with multiple series is displayed with each series stacked (`true`) or overlapped (`false`).

**Example:**

        var data = [
            {name: 'series1', data: [1,6,7,4]}, 
            {name: 'series2', data: [5,2,3,8]}
          ];

        new Contour({
            el: '.myLineChart',
            line: { stacked: true }
          })
        .cartesian()
        .line(data)
        .legend(data)
        .tooltip()
        .render();

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

If the series do not have the same number of data points, the series with the most number of data points needs to be the first series in the set if you are using `{stacked: true}`. (If the first series has fewer data points than one of the later series, an error is thrown when the `line` visualization is rendered. This is a known behavior of the underlying `d3.layout.stack` implementation.)
