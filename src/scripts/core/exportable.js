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
                    canvas.toBlob(function (imageBlob) {
                        var domUrl = root.URL || root.webkitURL;
                        var objectUrl = domUrl.createObjectURL(imageBlob);

                        dataUrlCreated(objectUrl, imageBlob, function () {
                            domUrl.revokeObjectURL(objectUrl);
                        });
                    }, options.type);
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

        checkEncodesBase64();
        checkADownloads();
        checkSavesMsBlobs();
        checkHasBlob();
        checkHasCanvasToBlob();
        checkExportsSvg();


        function checkEncodesBase64() {
            browser.encodesBase64 = !!root.btoa;

            // setup shim for IE9
            if (!browser.encodesBase64) {
                setupBase64Shim();
            }
        }

        function checkADownloads() {
            browser.aDownloads = document.createElement('a').download !== undefined;
        }

        function checkSavesMsBlobs() {
            browser.savesMsBlobs = !!navigator.msSaveOrOpenBlob;
        }

        function checkHasBlob() {
            root.URL = root.URL || root.webkitURL;
            browser.hasBlob = root.Blob && root.URL;

            if (!browser.hasBlob) {
                setupBlobShim();
            }
        }

        function checkHasCanvasToBlob() {
            browser.hasCanvasToBlob = HTMLCanvasElement && HTMLCanvasElement.prototype.toBlob;

            if (!browser.hasCanvasToBlob) {
                setupCanvasToBlobShim();
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

        // base64 shim, for IE9
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

        // blob shim, for IE9
        // from https://github.com/eligrey/Blob.js
        function setupBlobShim() {
            // Internally we use a BlobBuilder implementation to base Blob off of
            // in order to support older browsers that only have BlobBuilder
            var BlobBuilder = root.BlobBuilder || root.WebKitBlobBuilder || root.MozBlobBuilder || (function (root) {
                var get_class = function (object) {
                    return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
                };
                var FakeBlobBuilder = function BlobBuilder() {
                    this.data = [];
                };
                var FakeBlob = function Blob(data, type, encoding) {
                    this.data = data;
                    this.size = data.length;
                    this.type = type;
                    this.encoding = encoding;
                };
                var FBB_proto = FakeBlobBuilder.prototype;
                var FB_proto = FakeBlob.prototype;
                var FileReaderSync = root.FileReaderSync;
                var FileException = function (type) {
                    this.code = this[this.name = type];
                };
                var file_ex_codes = (
                    "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR " +
                    "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR"
                ).split(" ");
                var file_ex_code = file_ex_codes.length;
                var real_URL = root.URL || root.webkitURL || root;
                var real_create_object_URL = real_URL.createObjectURL;
                var real_revoke_object_URL = real_URL.revokeObjectURL;
                var URL = real_URL;
                var btoa = root.btoa;
                var atob = root.atob;

                var ArrayBuffer = root.ArrayBuffer;
                var Uint8Array = root.Uint8Array;
                var origin = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;

                FakeBlob.fake = FB_proto.fake = true;
                while (file_ex_code--) {
                    FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
                }
                // Polyfill URL
                if (!real_URL.createObjectURL) {
                    URL = root.URL = function (uri) {
                        var uri_info = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
                        var uri_origin;

                        uri_info.href = uri;
                        if (!("origin" in uri_info)) {
                            if (uri_info.protocol.toLowerCase() === "data:") {
                                uri_info.origin = null;
                            } else {
                                uri_origin = uri.match(origin);
                                uri_info.origin = uri_origin && uri_origin[1];
                            }
                        }
                        return uri_info;
                    };
                }
                URL.createObjectURL = function (blob) {
                    var type = blob.type;
                    var data_URI_header;

                    if (type === null) {
                        type = "application/octet-stream";
                    }
                    if (blob instanceof FakeBlob) {
                        data_URI_header = "data:" + type;
                        if (blob.encoding === "base64") {
                            return data_URI_header + ";base64," + blob.data;
                        } else if (blob.encoding === "URI") {
                            return data_URI_header + "," + decodeURIComponent(blob.data);
                        }
                        if (btoa) {
                            return data_URI_header + ";base64," + btoa(blob.data);
                        } else {
                            return data_URI_header + "," + encodeURIComponent(blob.data);
                        }
                    } else if (real_create_object_URL) {
                        return real_create_object_URL.call(real_URL, blob);
                    }
                };
                URL.revokeObjectURL = function (object_URL) {
                    if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
                        real_revoke_object_URL.call(real_URL, object_URL);
                    }
                };
                FBB_proto.append = function (data/*, endings*/) {
                    var bb = this.data;
                    // decode data to a binary string
                    if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
                        var str = "";
                        var buf = new Uint8Array(data);
                        var i = 0;
                        var buf_len = buf.length;

                        for (; i < buf_len; i++) {
                            str += String.fromCharCode(buf[i]);
                        }
                        bb.push(str);
                    } else if (get_class(data) === "Blob" || get_class(data) === "File") {
                        if (FileReaderSync) {
                            var fr = new FileReaderSync();
                            bb.push(fr.readAsBinaryString(data));
                        } else {
                            // async FileReader won't work as BlobBuilder is sync
                            throw new FileException("NOT_READABLE_ERR");
                        }
                    } else if (data instanceof FakeBlob) {
                        if (data.encoding === "base64" && atob) {
                            bb.push(atob(data.data));
                        } else if (data.encoding === "URI") {
                            bb.push(decodeURIComponent(data.data));
                        } else if (data.encoding === "raw") {
                            bb.push(data.data);
                        }
                    } else {
                        if (typeof data !== "string") {
                            data += ""; // convert unsupported types to strings
                        }
                        // decode UTF-16 to binary string
                        bb.push(unescape(encodeURIComponent(data)));
                    }
                };
                FBB_proto.getBlob = function (type) {
                    if (!arguments.length) {
                        type = null;
                    }
                    return new FakeBlob(this.data.join(""), type, "raw");
                };
                FBB_proto.toString = function () {
                    return "[object BlobBuilder]";
                };
                FB_proto.slice = function (start, end, type) {
                    var args = arguments.length;
                    if (args < 3) {
                        type = null;
                    }
                    return new FakeBlob(
                        this.data.slice(start, args > 1 ? end : this.data.length),
                        type,
                        this.encoding
                    );
                };
                FB_proto.toString = function () {
                    return "[object Blob]";
                };
                FB_proto.close = function () {
                    this.size = 0;
                    delete this.data;
                };
                return FakeBlobBuilder;
            }(root));

            root.Blob = function (blobParts, options) {
                var type = options ? (options.type || "") : "";
                var builder = new BlobBuilder();
                if (blobParts) {
                    for (var i = 0, len = blobParts.length; i < len; i++) {
                        builder.append(blobParts[i]);
                    }
                }
                return builder.getBlob(type);
            };
        }

        // canvas.toBlob() shim, for all current browsers
        // from https://github.com/eligrey/canvas-toBlob.js
        function setupCanvasToBlobShim() {
            var Uint8Array = root.Uint8Array;
            var HTMLCanvasElement = root.HTMLCanvasElement;
            var canvas_proto = HTMLCanvasElement && HTMLCanvasElement.prototype;
            var is_base64_regex = /\s*;\s*base64\s*(?:;|$)/i;
            var to_data_url = "toDataURL";
            var base64_ranks;
            var decode_base64 = function (base64) {
                var len = base64.length;
                var buffer = new Uint8Array(len / 4 * 3 | 0);
                var i = 0;
                var outptr = 0;
                var last = [0, 0];
                var state = 0;
                var save = 0;
                var rank;
                var code;
                var undef;

                while (len--) {
                    code = base64.charCodeAt(i++);
                    rank = base64_ranks[code-43];
                    if (rank !== 255 && rank !== undef) {
                        last[1] = last[0];
                        last[0] = code;
                        save = (save << 6) | rank;
                        state++;
                        if (state === 4) {
                            buffer[outptr++] = save >>> 16;
                            if (last[1] !== 61 /* padding character */) {
                                buffer[outptr++] = save >>> 8;
                            }
                            if (last[0] !== 61 /* padding character */) {
                                buffer[outptr++] = save;
                            }
                            state = 0;
                        }
                    }
                }
                // 2/3 chance there's going to be some null bytes at the end, but that
                // doesn't really matter with most image formats.
                // If it somehow matters for you, truncate the buffer up outptr.
                return buffer;
            };
            if (Uint8Array) {
                base64_ranks = new Uint8Array([
                    62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1,
                    -1, -1,  0, -1, -1, -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
                    10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
                    -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
                    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
                ]);
            }
            if (HTMLCanvasElement && !canvas_proto.toBlob) {
                canvas_proto.toBlob = function (callback, type /*, ...args*/) {
                    if (!type) {
                        type = "image/png";
                    }
                    if (this.mozGetAsFile) {
                        callback(this.mozGetAsFile("canvas", type));
                        return;
                    }
                    if (this.msToBlob && /^\s*image\/png\s*(?:$|;)/i.test(type)) {
                        callback(this.msToBlob());
                        return;
                    }

                    var args = Array.prototype.slice.call(arguments, 1);
                    var dataURI = this[to_data_url].apply(this, args);
                    var header_end = dataURI.indexOf(",");
                    var data = dataURI.substring(header_end + 1);
                    var is_base64 = is_base64_regex.test(dataURI.substring(0, header_end));
                    var blob;

                    if (Blob.fake) {
                        // no reason to decode a data: URI that's just going to become a data URI again
                        blob = new Blob();
                        if (is_base64) {
                            blob.encoding = "base64";
                        } else {
                            blob.encoding = "URI";
                        }
                        blob.data = data;
                        blob.size = data.length;
                    } else if (Uint8Array) {
                        if (is_base64) {
                            blob = new Blob([decode_base64(data)], {type: type});
                        } else {
                            blob = new Blob([decodeURIComponent(data)], {type: type});
                        }
                    }
                    callback(blob);
                };

                if (canvas_proto.toDataURLHD) {
                    canvas_proto.toBlobHD = function () {
                        to_data_url = "toDataURLHD";
                        var blob = this.toBlob();
                        to_data_url = "toDataURL";
                        return blob;
                    };
                } else {
                    canvas_proto.toBlobHD = canvas_proto.toBlob;
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
