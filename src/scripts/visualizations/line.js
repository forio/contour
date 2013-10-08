(function (ns, d3, _, $, undefined) {

    function ctor(data) {

        this.data(data);

        var renderer = function (svg) {
            var g = svg.append('g')
                .attr('vis-id', renderer.id);

            // svg.append('text')
            //     .text('hello world!');
            return this;
        };

        this.options.visualizations.push(renderer);

        return this;
    }

    Narwhal.export('line', ctor);

})('Narwhal', window.d3, window._, window.jQuery);
