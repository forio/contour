(function () {

    var defaults = {
        type: 'image/png',
        backgroundColor: '#fff',
        fileName: 'contour.png'
    };

    // browser capabilities
    var browser = {
        checked: false // true after browser capabilities have been checked
    };
    // shims depending on current browser
    var shim = {
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
                exportImage.call(this, options, 'download');

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
                exportImage.call(this, options, 'place');

                return this;
            }
        };


        // svg to canvas export function
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
                    // use canvg renderer for image export
                    renderImageCanvg();
                } else {
                    // use native renderer for image export (this might fail)
                    renderImageNative();
                }

                function imageRendered() {
                    var imageDataUrl = canvas.toDataURL(options.type);
                    var imageBlob = dataUrlToBlob(imageDataUrl);

                    var domUrl = root.URL || root.webkitURL || root;
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
                    // note that canvg gets the svg element dimensions incorrectly if not specified as attributes
                    // also this canvg call is synchronous and blocks
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


        // clone svg in isolation with styles directly applied
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
                        // note that checking for sourceStyle.hasOwnProperty(prop) eliminates all valid style properties in firefox
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
            // get bounds from original svg, and proportion them based on specified options
            var bounds = svgNode.getBoundingClientRect();
            var boundsClone = getProportionedBounds(bounds, options);

            // clone svg in isolation with styles directly applied
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
                                // safari can only open a new tab with the image
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

        checkEncodesBase64();
        checkHasTypedArray();
        checkADownloads();
        checkSavesMsBlobs();
        checkExportsSvg();


        function checkEncodesBase64() {
            browser.encodesBase64 = !!root.btoa;

            // setup shim for IE9
            if (!browser.encodesBase64) {
                setupBase64Shim();
            }
        }

        function checkHasTypedArray() {
            browser.hasTypedArray = !!root.Uint8Array;

            if (!browser.hasTypedArray) {
                setupTypedArrayShim();
            }
        }

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

                // load canvg svg renderer for browsers that can't safely export svg
                if (!browser.exportsSvg) {
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

        function setupBase64Shim() {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

            function InvalidCharacterError(message) {
                this.message = message;
            }
            InvalidCharacterError.prototype = new Error();
            InvalidCharacterError.prototype.name = 'InvalidCharacterError';

            // base64 encoder
            // from https://gist.github.com/999166
            root.btoa = function (input) {
                var str = String(input);
                for (
                    // initialize result and counter
                    var block, charCode, idx = 0, map = chars, output = '';
                    // if the next str index does not exist:
                    //   change the mapping table to "="
                    //   check if d has no fractional digits
                    str.charAt(idx | 0) || (map = '=', idx % 1);
                    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
                    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
                ) {
                    charCode = str.charCodeAt(idx += 3 / 4);
                    if (charCode > 0xFF) {
                        throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
                    }
                    block = block << 8 | charCode;
                }
                return output;
            };

            // base64 decoder
            // from https://gist.github.com/1020396
            root.atob = function (input) {
                var str = String(input).replace(/=+$/, '');
                if (str.length % 4 == 1) {
                    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
                }
                for (
                    // initialize result and counters
                    var bc = 0, bs, buffer, idx = 0, output = '';
                    // get next character
                    (buffer = str.charAt(idx++));
                    // character found in table? initialize bit storage and add its ascii value;
                    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                        // and if not first of each 4 characters,
                        // convert the first 8 bits to one ascii character
                        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
                ) {
                    // try to find character in table (0-63, not found => -1)
                    buffer = chars.indexOf(buffer);
                }
                return output;
            };
        }

        function setupTypedArrayShim() {
            root.Uint8Array = TypedArray;
            root.Uint32Array = TypedArray;
            root.Int32Array = TypedArray;


            function subarray(start, end) {
                return this.slice(start, end);
            }
         
            function set_(array, offset) {
                if (arguments.length < 2) offset = 0;
                for (var i = 0, n = array.length; i < n; ++i, ++offset) {
                    this[offset] = array[i] & 0xFF;
                }
            }
         
            // we need typed arrays
            function TypedArray(arg1) {
                var result;
                if (typeof arg1 === 'number') {
                    result = new Array(arg1);
                    for (var i = 0; i < arg1; ++i) {
                        result[i] = 0;
                    }
                } else {
                    result = arg1.slice(0);
                }
                result.subarray = subarray;
                result.buffer = result;
                result.byteLength = result.length;
                result.set = set_;
                if (typeof arg1 === 'object' && arg1.buffer) {
                    result.buffer = arg1.buffer;
                }
         
                return result;
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
