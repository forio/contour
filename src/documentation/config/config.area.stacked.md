#### **stacked** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

Whether a single area visualization that has data with multiple series is displayed with each series stacked (`true`) or overlapped (`false`).

**Example:**

        var data = [
            {name: 'series1', data: [1,6,7,4]}, 
            {name: 'series2', data: [5,2,3,8]}
          ];

        new Contour({
            el: '.myAreaChart',
            area: { stacked: false }
          })
        .cartesian()
        .area(data)
        .legend(data)
        .render();

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

