#### **title** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

To override any of the default configuration options for your title, include the `title` configuration object in the configuration options that you pass to your Contour constructor.

**Example:**

        new Contour({
            el: '.myChart',
            title: {
                // title-specific configuration options
                }
            })
           .cartesian()
           .trendLine([1, 1, 2, 3, 5, 7, 12])
           .title()
           .render();

<% if(notes) { %><%= notes %><% } %>
