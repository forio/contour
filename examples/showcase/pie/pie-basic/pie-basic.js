(function () {
    new Narwhal({
            el: '.pie-basic',
        })
        .pie([ 1, 2, 3, 4 ])
        .tooltip()
        .render();
})();