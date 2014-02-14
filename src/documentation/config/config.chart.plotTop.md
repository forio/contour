#### **plotTop** : { integer }

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance, in pixels, from the top of the browser window to the top of the [yAxis](#config_config.yAxis). The value changes as the visualization is rendered, as the browser is resized and page is reloaded, etc. 

Functionality such as tooltips, which check whether they are within the boundaries of the plot, reference this. 

**Notes:** Read only.

<% if(notes) { %><%= notes %><% } %>

