#### **margin** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The whitespace, in pixels, between the container of this Narwhal instance and the outer edge of any visualizations in this Narwhal instance (for example, the labels or axis titles). 

The container of this Narwhal instance has its dimensions determined by [`defaultWidth`](), [`width`](), [`defaultAspect`](), and [`height`]().

The `margin` configuration property needs to include at least one of [`top`](), [`bottom`](), [`right`](), and [`left`]().

<% if(notes) { %><%= notes %><% } %>

