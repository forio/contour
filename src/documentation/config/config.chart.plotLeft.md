#### **plotLeft** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance, in pixels, from the left of the browser window to the top of the [yAxis](#config_config.yAxis). (Note this is the distance to the yAxis, not to the yAxis labels or tick marks.) The value changes as the visualization is rendered, as the browser is resized and page is reloaded, etc. 

Functionality such as tooltips, which check whether they are within the boundaries of the plot, reference this. 

**Notes:** Read only.

<% if(notes) { %><%= notes %><% } %>

