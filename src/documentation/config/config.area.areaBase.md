#### **areaBase** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

Turn the area chart into a horizon chart, setting the horizon at `areaBase`. 

**Example:**

    var data = [10, 60, 70, 40];

    new Contour({
        el: '.myChart',
        area: { areaBase: 50 }
      })
    .cartesian()
    .area(data)
    .render(); 
 
<% if(notes) { %><%= notes %><% } %>

