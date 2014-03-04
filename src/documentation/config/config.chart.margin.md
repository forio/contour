#### **margin** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The whitespace, in pixels, between the container of this Contour instance and the outer edge of any visualizations in this Contour instance (for example, the labels or axis titles). 

The container of this Contour instance has its dimensions determined by [`defaultWidth`](#config_config.chart.defaultWidth), [`width`](#config_config.chart.width), [`defaultAspect`](#config_config.chart.defaultWidth), and [`height`](#config_config.chart.height).

The `margin` configuration property needs to include at least one of [`top`](#config_config.chart.margin.top), [`bottom`](#config_config.chart.margin.bottom), [`right`](#config_config.chart.margin.right), and [`left`](#config_config.chart.margin.left).

<% if(notes) { %><%= notes %><% } %>

