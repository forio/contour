#### **padding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The whitespace, in pixels, between the outer edge of any visualizations in this Narwhal instance (for example, the labels or axis titles) and the inner plot area (for example, the axes).

The `padding` configuration property needs to include at least one of [`top`](), [`bottom`](), [`right`](), and [`left`]().

**Notes:**

This `padding` is distinct from the `margin`. The `margin` is the whitespace, in pixels, between the container of this Narwhal instance and the outer edge of any visualizations in this Narwhal instance (for example, the labels or axis titles). (The container, in turn, has its dimensions determined by [`defaultWidth`](), [`width`](), [`defaultAspect`](), and [`height`]().)

<% if(notes) { %><%= notes %><% } %>

