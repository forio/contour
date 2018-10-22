#### **text** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

**Example:**

        new Contour({
            el: '.myChart',
            title: {
                text: 'First Seven Fibonacci Numbers'
                }
            })
           .cartesian()
           .trendLine([1, 1, 2, 3, 5, 7, 12])
           .title()
           .render();

<% if(notes) { %><%= notes %><% } %>
