(function () {
    'use strict';

    var baseContourVersion =  '0.9.107';
    var contourVersion;
    var samples = [
        "area/area-basic",
        "area/area-combo",
        "area/area-stacked",
        "bar/bar-basic",
        "bar/bar-export",
        "bar/bar-grouped",
        "bar/bar-stacked",
        "bar/bar-styled",
        "bar/bar-image",
        "column/column-basic",
        "column/column-styled",
        "column/column-grouped",
        "column/column-width",
        "column/column-stacked",
        "line/line-basic",
        "line/line-markers",
        "line/line-dates",
        "line/line-export",
        "line/line-multi-basic",
        "line/line-sine",
        "pie/pie-basic",
        "pie/pie-donut",
        "pie/pie-gauge",
        "pie/pie-series",
        "pie/donut-series",
        "scatter/scatter-basic",
        "scatter/scatter-export",
        "scatter/scatter-trendline"
    ];

    contourVersion = getContourVersion();
    buildMenu(samples);
    doRouting();

    function getContourVersion() {
        if (!/ver=/.test(window.location.search)) {
            return baseContourVersion;
        }

        var version = window.location.search.match(/ver=(\d+\.\d+\.\d+)/);
        return version[1] || baseContourVersion;
    }

    function onSampleLoad() {
        var height = $(this.contentDocument).height();
        $(this).height(height);
    }

    function doRouting() {
        var hash = document.location.hash.replace('#', '');
        if (hash.length) {
            loadSamples(hash, onSampleLoad);
        }
    }

    function buildMenu(data) {
        var items = [];
        var curPalette = 'palette-1';

        $.each(data, function (i, d) {
            var li = $('<li>').text(d).attr('data-path', d);
            items.push(li);
        });

        var ul = $('<ul>').addClass('list-unstyled');
        ul.append(items).appendTo('.menu');
        ul.on('click', 'li', function () {
            var path = $(this).data('path');
            document.location.hash = '#/' + path;
            loadSamples(path);
        });

        $('.palette-selector').on('change', function () {
            var iframe = d3.select('iframe').node();
            var newPalette = 'palette-' + $(this).val();

            d3.select(iframe.contentDocument)
                .selectAll('.series')
                    .classed(curPalette, false)
                    .classed(newPalette, true);

            curPalette = newPalette;
        });
    }

    function loadSamples(path, onLoad) {
        var fullPath = 'showcase/' + path;
        var frame = $('#sample');

        $('.chart-id').text(path);

        $.get(fullPath + '/demo.html', function (res) {
            var iframe = frame.get(0);
            var contents = [];
            var doc;

            if (iframe.contentDocument) {
                doc = iframe.contentDocument;
            } else if (iframe.contentWindow) {
                doc = iframe.contentWindow.document;
            } else {
                doc = iframe.document;
            }

            // set up the onload callback... this is where the caller can resize the iframe
            $(iframe).on('load', onLoad);

            // now we start adding stuff
            // add jquery and the demo css to the head first
            contents.push('<script src="../examples/js/vendor/jquery.js"></script>');

            // force a specific contour version
            res = res.replace(/(https?:\/\/forio\.com\/tools\/contour\/)([\w\d\.\-\_]+)/g, function ($1, $2, $3) {
                if (/local/.test(window.location.href)) {
                    return '/dist/' + $3;
                }

                return $2 + contourVersion + '/' + $3;
            });

            // now add the html
            contents.push(res);

            // add the css after the html so we get the demo.css to have priority over
            // the default contour.css
            contents.push('<link rel="stylesheet" href="' + fullPath + '/demo.css">');
            contents.push('<script src="' + fullPath + '/demo.js"></script>');

            // now write everything the iframes document
            doc.open();
            doc.writeln(contents.join(''));
            doc.close();
        });
    }

})();
