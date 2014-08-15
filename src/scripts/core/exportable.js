(function () {

    var defaults = {
        type: 'image/png', // the mime type of the image; see http://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support for browser support
        fileName: 'contour.png', // the fileName for the download
        target: undefined, // a selector for the container; for example '#image'
        backgroundColor: '#fff', // the fill color of the image, or `null` for transparent background
        width: undefined, // the width of the exported image; if `height` is falsy then the height will be scaled proportionally
        height: undefined // the height of the exported image; if `width` is falsy then the width will be scaled proportionally
    };

    // browser capabilities
    var browser = {
        checked: false // true after browser capabilities have been checked
    };


    var exportable = function () {
        // css rules to ignore for diff
        var ignoreDiff = {
            cssText: 1,
            parentRule: 1
        };


        // interface

        return {
            init: function () {
                // check browser capabilities and set up necessary shims
                // only do this once per page load
                if (!browser.checked) checkBrowser();

                return this;
            },

            /**
            * Saves a visualization as an image, triggering a download.
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
            *     `type` specifies the mime type of the image. See http://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support for browser support. (Default: 'image/png'.)
            *     `fileName` specifies the fileName for the download. (Default: 'contour.png'.)
            *     `backgroundColor` specifies the fill color of the image, or `null` for transparent background. (Default: '#fff'.)
            *     `width` specifies the width of the exported image. If `height` is falsy then the height will be scaled proportionally. (Default: `undefined` which means don't do any scaling.)
            *     `height` specifies the height of the exported image. If `width` is falsy then the width will be scaled proportionally. (Default: `undefined` which means don't do any scaling.)
            */
            download: function (options) {
                exportImage.call(this, options, 'download');

                return this;
            },

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
            *         contour.place({
            *             target: '#image'
            *         });
            *
            * @name place
            * @param {object} options Configuration options specific to saving the image.
            *     `type` specifies the mime type of the image. See http://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support for browser support. (Default: 'image/png'.)
            *     `target` specifies a selector for the container. (For example: '#image' will append the image into `<div id="image"></div>`.)
            *     `backgroundColor` specifies the fill color of the image, or `null` for transparent background. (Default: '#fff'.)
            *     `width` specifies the width of the exported image. If `height` is falsy then the height will be scaled proportionally. (Default: `undefined` which means don't do any scaling.)
            *     `height` specifies the height of the exported image. If `width` is falsy then the width will be scaled proportionally. (Default: `undefined` which means don't do any scaling.)
            */
            place: function (options) {
                exportImage.call(this, options, 'place');

                return this;
            }
        };


        // SVG to canvas export function
        // adapted from https://github.com/sampumon/SVG.toDataURL
        // which based on http://svgopen.org/2010/papers/62-From_SVG_to_Canvas_and_Back/#svg_to_canvas
        function getSvgDataUrl(svg, options, dataUrlCreated) {
            switch (options.type) {
                case 'image/svg+xml':
                    return makeSvgUrl();

                default: // 'image/png' or 'image/jpeg'
                    return makeImageUrl();
            }


            function encodeBase64DataUrl(svgXml) {
                // https://developer.mozilla.org/en/DOM/window.btoa
                return 'data:image/svg+xml;base64,' + btoa(svgXml);
            }

            // convert base64/URLEncoded data component to raw binary data held in a string
            function dataUrlToBlob(dataUrl) {
                var byteString;
                if (dataUrl.split(',')[0].indexOf('base64') >= 0) {
                    byteString = atob(dataUrl.split(',')[1]);
                } else {
                    byteString = unescape(dataUrl.split(',')[1]);
                }

                // separate out the mime component
                var mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];

                // write the bytes of the string to a typed array
                var byteArray = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                    byteArray[i] = byteString.charCodeAt(i);
                }

                return new Blob([byteArray], {
                    type: mimeString
                });
            }

            function makeSvgUrl() {
                var svgXml = (new XMLSerializer()).serializeToString(svg);
                var svgDataUrl = encodeBase64DataUrl(svgXml);

                dataUrlCreated(svgDataUrl, null, function () {});
            }

            function makeImageUrl() {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');

                var svgXml = (new XMLSerializer()).serializeToString(svg);

                if (root.canvg) {
                    // use Canvg renderer for image export
                    renderImageCanvg();
                } else {
                    // use native renderer for image export (this might fail)
                    renderImageNative();
                }

                function imageRendered() {
                    var imageDataUrl = canvas.toDataURL(options.type);
                    var imageBlob = dataUrlToBlob(imageDataUrl);

                    var domUrl = root.URL || root.webkitURL;
                    var objectUrl = domUrl.createObjectURL(imageBlob);

                    dataUrlCreated(objectUrl, imageBlob, function () {
                        domUrl.revokeObjectURL(objectUrl);
                    });
                }

                function renderImageNative() {
                    var svgImg = new Image();
                    svgImg.src = encodeBase64DataUrl(svgXml);

                    svgImg.onload = function () {
                        canvas.width = svgImg.width;
                        canvas.height = svgImg.height;

                        if (options.backgroundColor) {
                            context.fillStyle = options.backgroundColor;
                            context.fillRect(0, 0, svgImg.width, svgImg.height);
                        }

                        context.drawImage(svgImg, 0, 0);

                        imageRendered();
                    };

                    svgImg.onerror = function () {
                        console.log('Cannot export image');
                    };
                }

                function renderImageCanvg() {
                    // note that Canvg gets the SVG element dimensions incorrectly if not specified as attributes
                    // also this Canvg call is synchronous and blocks
                    canvg(canvas, svgXml, {
                        ignoreMouse: true,
                        ignoreAnimation: true,
                        offsetX: undefined,
                        offsetY: undefined,
                        scaleWidth: undefined,
                        scaleHeight: undefined,
                        renderCallback: imageRendered
                    });
                }
            }
        }


        // clone SVG in isolation with styles directly applied
        function createSvgClone(svgNode, svgCloned) {
            createIsolatedNode(function (nodeClone, destroyIsolatedNode) {
                // clone nodes and apply styles directly to each node
                cloneNodes(svgNode, nodeClone);

                svgCloned(d3.select(nodeClone).select('svg').node(), destroyIsolatedNode);
            });


            // compare computed styles at this node and apply the differences directly
            function applyStyles(sourceNode, targetNode) {
                var sourceStyle = root.getComputedStyle(sourceNode);
                var targetStyle = root.getComputedStyle(targetNode);

                for (var prop in sourceStyle) {
                    if (!ignoreDiff[prop] && !isFinite(prop)) {
                        // note that checking for sourceStyle.hasOwnProperty(prop) eliminates all valid style properties in Firefox
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

                // compare computed styles at this node and apply the differences directly
                applyStyles(sourceNode, newNode);

                _.each(sourceNode.childNodes, function (childNode) {
                    // clone each child node and apply styles
                    cloneNodes(childNode, newNode);
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
                        // destroy clone
                        iframeDocument.body.removeChild(nodeClone);
                        document.body.removeChild(iframe);
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
            // merge configuration options with defaults
            options = options || {};
            _.defaults(options, defaults);

            var svgNode = this.container.select('svg').node();
            // get bounds from original SVG, and proportion them based on specified options
            var bounds = svgNode.getBoundingClientRect();
            var boundsClone = getProportionedBounds(bounds, options);

            // clone SVG in isolation with styles directly applied
            createSvgClone(svgNode, performExport);

            function performExport(svgNodeClone, destroySvgClone) {
                svgNodeClone.setAttribute('width', boundsClone.width);
                svgNodeClone.setAttribute('height', boundsClone.height);

                getSvgDataUrl(svgNodeClone, options, function (url, blob, revokeUrl) {
                    destroySvgClone();

                    // exporter functions
                    var exporters = {
                        'download': function () {
                            if (browser.aDownloads) {
                                // make a link to download and click it
                                var a = document.createElement('a');
                                a.download = options.fileName;
                                a.href = url;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            } else if (browser.savesMsBlobs && blob) {
                                // IE9-11 support a method to save/open a blob
                                navigator.msSaveOrOpenBlob(blob, options.fileName);
                            } else {
                                // Safari can only open a new tab with the image
                                root.open(url);
                            }
                            // wait for download to start
                            setTimeout(function () {
                                revokeUrl();
                            }, 1);
                        },
                        'place': function () {
                            var img = document.createElement('img');
                            img.onload = function () {
                                revokeUrl();
                            };
                            img.src = url;
                            d3.select(options.target).node().appendChild(img);
                        }
                    };
                    // call exporter function
                    exporters[exporter]();
                });
            }
        }
    };


    // check browser capabilities and set up necessary shims
    function checkBrowser() {
        browser.checked = true;

        checkADownloads();
        checkSavesMsBlobs();
        checkExportsSvg();


        function checkADownloads() {
            browser.aDownloads = document.createElement('a').download !== undefined;
        }

        function checkSavesMsBlobs() {
            browser.savesMsBlobs = !!navigator.msSaveOrOpenBlob;
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
                    var xml = (new XMLSerializer()).serializeToString(svg);
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

                // load Canvg SVG renderer for browsers that can't safely export SVG
                if (!browser.exportsSvg) {
                    setupCanvgShim();
                }
            }
        }

        // Canvg shim, for IE9-11 and Safari
        function setupCanvgShim() {
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
