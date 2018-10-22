#### **position** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The position option defines where your title will be aligned on the SVG X-Axis. It can take the values `left`, `center`, or `right`. If no value is supplied (or an invalid one is supplied), it will default to `left`.

**Example:**

        new Contour({
            el: '.myChart',
            title: {
                text: 'First Seven Fibonacci Numbers',
                position: 'center'
                }
            })
           .cartesian()
           .trendLine([1, 1, 2, 3, 5, 7, 12])
           .title()
           .render();

<% if(notes) { %><%= notes %><% } %>
