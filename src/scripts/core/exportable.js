(function () {

    var defaults = {
        type: 'image/png',
        fill: '#fff',
        fileName: 'contour.png'
    };
    var browser = { // browser capabilities
        checked: false
    };
    var shim = {
        encodeBase64: undefined, // base 64 encoder
        serializeXml: undefined // xml serializer
    }; // shims for less capable browsers


    var exportable = function () {
        var ignoreDiff = { // css rules to ignore for diff
            cssText: 1,
            parentRule: 1
        };
        var self; // reference to this contour


        // interface

        return {
            init: function () {
                self = this;

                if (!browser.checked) checkBrowser();

                return this;
            },

            /**
            * Saves a visualization as an image, triggering a download.
            *
            * `type` specfies the mime type of the image. See http://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support for browser support. (Default: 'image/png'.)
            * `fileName` specifies the fileName for the download. (Default: 'contour.png'.)
            *
            * ###Example:
            *
            *     var contour = new Contour(...)
            *         ...
            *         .exportable()
            *         .render();
            *     document.getElementById('save').onclick = function () {
            *         contour.download({
            *             fileName: 'contour.png',
            *             width: 640
            *         });
            *
            * @name download
            * @param {object} options Configuration options specific to saving the image.
            */
            download: function (options) {
                exportImage(options, 'download');

                return this;
            },

            /**
            * Saves a visualization as an image.
            *
            * `type` specfies the mime type of the image. See http://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support for browser support. (Default: 'image/png'.)
            * `target` specifies a selector for the container. (For example: `target: '#vis'` will insert the image in `<div id="vis"></div>`.)
            *
            * ###Example:
            *
            *     var contour = new Contour(...)
            *         ...
            *         .exportable()
            *         .render();
            *     document.getElementById('save').onclick = function () {
            *         contour.place({
            *             target: '#image'
            *         });
            *
            * @name place
            * @param {object} options Configuration options specific to saving the image.
            */
            place: function (options) {
                exportImage(options, 'place');

                return this;
            }
        };


        // svg to canvas export function
        // adapted from https://github.com/sampumon/SVG.toDataURL
        // which based on http://svgopen.org/2010/papers/62-From_SVG_to_Canvas_and_Back/#svg_to_canvas

        // exports svg to canvas
        function getSvgDataUrl(svg, options, dataUrlCreated) {
            switch (options.type) {
                case 'image/svg+xml':
                    return exportSvg();

                default: // 'image/png' or 'image/jpeg'
                    return exportImage();
            }


            function encodeBase64DataUrl(svgXml) {
                // https://developer.mozilla.org/en/DOM/window.btoa
                return 'data:image/svg+xml;base64,' + shim.encodeBase64(svgXml);
            }

            function exportSvg() {
                var svgXml = shim.serializeXml(svg);
                var svgDataUrl = encodeBase64DataUrl(svgXml);

                dataUrlCreated(svgDataUrl); // double data carrier
            }

            function exportImage() {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                if (options.fill) {
                    context.fillStyle = options.fill;
                    context.fillRect(0, 0, snapshot.width, snapshot.height);
                }

                var svgXml = shim.serializeXml(svg);

                if (window.canvg) { // use canvg renderer for image export
                    renderImageCanvg();
                } else { // use native renderer for image export (this might fail)
                    renderImageNative();
                }

                function imageRendered() {
                    var imageDataUrl = canvas.toDataURL(options.type);
                    dataUrlCreated(imageDataUrl);
                }

                function renderImageNative() {
                    var svgImg = new Image();
                    svgImg.src = encodeBase64DataUrl(svgXml);

                    svgImg.onload = function () {
                        canvas.width = svgImg.width;
                        canvas.height = svgImg.height;
                        context.drawImage(svgImg, 0, 0);

                        imageRendered();
                    };

                    svgImg.onerror = function () {
                        console.log('Cannot export image');
                    };
                }

                function renderImageCanvg() {
                    // NOTE: canvg gets the svg element dimensions incorrectly if not specified as attributes
                    // NOTE: this canvg call is synchronous and blocks
                    canvg(canvas, svgXml, {
                        ignoreMouse: true,
                        ignoreAnimation: true,
                        offsetX: undefined,
                        offsetY: undefined,
                        scaleWidth: undefined,
                        scaleHeight: undefined,
                        renderdataUrlCreated: imageRendered
                    });
                }
            }
        }


        // clone svg in isolation with styles directly applied
        function createSvgClone(svgNode, svgCloned) {
            createIsolatedNode(function (nodeClone, destroyIsolatedNode) {
                cloneNodes(svgNode, nodeClone); // clone nodes and apply styles directly to each node

                svgCloned(d3.select(nodeClone).select('svg').node(), destroyIsolatedNode);
            });


            // compare computed styles at this node and apply the differences directly
            function applyStyles(sourceNode, targetNode) {
                var sourceStyle = window.getComputedStyle(sourceNode);
                var targetStyle = window.getComputedStyle(targetNode);

                for (var prop in sourceStyle) {
                    if (!ignoreDiff[prop] && !isFinite(prop)) { // note that checking for sourceStyle.hasOwnProperty(prop) eliminates all valid style properties in firefox
                        if (targetStyle[prop] !== sourceStyle[prop]) {
                            targetNode.style[prop] = sourceStyle[prop];
                        }
                    }
                }
            }

            // clone nodes and apply styles directly to each node
            function cloneNodes(sourceNode, targetNode) {
                var newNode = sourceNode.cloneNode(false);
                targetNode.appendChild(newNode);

                if (!sourceNode.tagName) return; // skip inner text

                applyStyles(sourceNode, newNode); // compare computed styles at this node and apply the differences directly

                _.each(sourceNode.childNodes, function (childNode) {
                    cloneNodes(childNode, newNode); // clone each child node and apply styles
                });
            }

            function createIsolatedNode(nodeLoaded) {
                var iframe = document.body.appendChild(document.createElement('iframe'));
                iframe.style.visibility = 'hidden';
                var iframeWindow = iframe.contentWindow;
                var iframeDocument = iframeWindow.document;

                iframe.onload = function () {
                    var nodeClone = iframeDocument.createElement('div');
                    iframeDocument.body.appendChild(nodeClone);

                    var destroyIframe = function () {
                        iframeDocument.body.removeChild(nodeClone);
                        document.body.removeChild(iframe); // destroy clone
                    };

                    nodeLoaded(nodeClone, destroyIframe);
                };

                iframeDocument.open();
                iframeDocument.write('<!DOCTYPE html>');
                iframeDocument.write('<html><head></head><body></body></html>');
                iframeDocument.close();
            }
        }


        function getProportionedBounds(original, specified) {
            if (specified.width && specified.height) {
                return specified;
            } else if (specified.width) {
                return {
                    width: specified.width,
                    height: specified.width * original.height / original.width
                };
            } else if (specified.height) {
                return {
                    width: specified.height * original.width / original.height,
                    height: specified.height
                };
            } else {
                return original;
            }
        }


        function exportImage(options, exporter) {
            options = options || {};
            _.defaults(options, defaults); // merge configuration options with defaults

            var svgNode = self.container.select('svg').node();
            var bounds = svgNode.getBoundingClientRect(); // get bounds from original svg
            var boundsClone = getProportionedBounds(bounds, options);

            createSvgClone(svgNode, performExport); // clone svg in isolation with styles directly applied

            function performExport(svgNodeClone, destroySvgClone) {
                svgNodeClone.setAttribute('width', boundsClone.width);
                svgNodeClone.setAttribute('height', boundsClone.height);

                getSvgDataUrl(svgNodeClone, options.type, function (canvasData) {
                    destroySvgClone();

                    // call exporter function
                    var exporters = {
                        'download': function () {
                            // make a link to download and click it
                            var a = document.createElement('a');
                            a.download = options.fileName;
                            a.href = canvasData;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        },
                        'place': function () {
                            var img = document.createElement('img');
                            img.src = canvasData;
                            d3.select(options.target).node().appendChild(img);
                        }
                    };
                    exporters[exporter](); // call exporter function
                });
            }
        }
    };


    function checkBrowser() {
        browser.checked = true;

        checkEncodesBase64();
        checkSerializesXml();
        checkExportsSvg();


        function checkEncodesBase64() {
            browser.encodesBase64 = !!window.btoa;

            if (browser.encodesBase64) {
                shim.encodeBase64 = function (s) { // use window.btoa for base64 encoding
                    return btoa(s); // note that it won't work as just `shim.encodeBase64 = btoa;`, therefore it needs to be wrapped
                };
            } else {
                shim.encodeBase64 = base64Encode; // use custom base64 encoder
            }


            // base64 encode
            // adapted from http://www.webtoolkit.info/
            function base64Encode(input) {
                var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                var output = '';
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;

                input = utf8_encode(input);

                while (i < input.length) {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                }

                return output;

            }

            function utf8_encode(string) {
                string = string.replace(/\r\n/g, '\n');
                var utftext = '';

                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }

                return utftext;
            }
        }

        function checkSerializesXml() {
            browser.serializesXml = !!window.XMLSerializer;

            if (browser.serializesXml) {
                shim.serializeXml = function (xml) { // use standard XMLSerializer.serializeToString
                    return (new XMLSerializer()).serializeToString(xml);
                };
            } else {
                shim.serializeXml = serializeXmlToString; // use custom serializeXmlToString for IE9
            }

            // quick-n-serialize an SVG dom, needed for IE9 where there's no XMLSerializer nor SVG.xml
            // s: SVG dom, which is the <svg> elemennt
            function serializeXmlToString(s) {
                var out = '<' + s.nodeName;
                for (var i = 0; i < s.attributes.length; i++) {
                    out += ' ' + s.attributes[i].name + '=' + '"' + s.attributes[i].value + '"';
                }

                if (s.hasChildNodes()) {
                    out += '>\n';
                    for (var j = 0; j < s.childNodes.length; j++) {
                        out += serializeXmlToString(s.childNodes[j]);
                    }
                    out += '</' + s.nodeName + '>' + '\n';
                } else out += ' />\n';

                return out;
            }
        }

        function checkExportsSvg() {
            browser.exportsSvg = false;

            var iframe = document.body.appendChild(document.createElement('iframe'));
            iframe.style.visibility = 'hidden';
            var doc = iframe.contentWindow.document;

            iframe.onload = function () {
                try {
                    var svg = doc.querySelector('svg');
                    var img = doc.querySelector('img');
                    var canvas = doc.querySelector('canvas');
                    var context = canvas.getContext('2d');
                    canvas.width = img.getAttribute('width') * 1;
                    canvas.height = img.getAttribute('height') * 1;
                    var sourceImg = new Image();
                    sourceImg.width = canvas.width;
                    sourceImg.height = canvas.height;
                    sourceImg.onload = function () {
                        try {
                            context.drawImage(sourceImg, 0, 0, img.width, img.height);
                            img.src = canvas.toDataURL();

                            browser.exportsSvg = true; // yay
                        } catch (e) {}

                        svgExportChecked();
                    };
                    var xml = shim.serializeXml(svg);
                    sourceImg.src = 'data:image/svg+xml,' + encodeURIComponent(xml);
                } catch (e) {
                    svgExportChecked();
                }
            };

            doc.open();
            doc.write('<!DOCTYPE html>');
            doc.write('<html><head></head><body>');
            doc.write('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 1 1"><circle r="1" fill="red"/></svg>');
            doc.write('<img width="2" height="2">');
            doc.write('<canvas></canvas>');
            doc.write('</body></html>');
            doc.close();


            function svgExportChecked() {
                document.body.removeChild(iframe);

                if (!browser.exportsSvg) { // load canvg svg renderer for browsers that can't safely export svg
                    _.each([
                        'rgbcolor.js',
                        'StackBlur.js',
                        'canvg.js'
                    ], function (src) {
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.src = 'http://canvg.googlecode.com/svn/trunk/' + src;
                        document.head.appendChild(script);
                    });
                }
            }
        }
    }


    /**
    * Saves a visualization as an image.
    *
    * ###Example:
    *
    *     var contour = new Contour(...)
    *         ...
    *         .exportable()
    *         .render();
    *     document.getElementById('save').onclick = function () {
    *         contour.download({
    *             fileName: 'contour.png'
    *         });
    *
    * @name exportable
    */
    Contour.expose('exportable', exportable);

})();
