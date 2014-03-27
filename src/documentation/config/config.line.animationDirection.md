#### **animationDirection** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The direction of the [`animations`](#config_config.chart.animations), if [enabled](#config_config.chart.animations.enable).  

* `left-to-right` is the default.
* `bottom-to-top` is also available.

**Notes:**

Only available for [`line`](#config_config.line) charts.

<% if(notes) { %><%= notes %><% } %>

