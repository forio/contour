#### **enable** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

When `true`, tooltip tracker elements are rendered into the SVG.

When `false`, no tooltip tracker markup is added to the svg. This could be a performance improvement.

**Notes:**

disabling tooltips when not needed can have a performance improvement in the rendering of the chart.

<% if(notes) { %><%= notes %><% } %>

