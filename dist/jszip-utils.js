/*@preserve

JSZipUtils - A collection of cross-browser utilities to go along with JSZip.
<http://stuk.github.io/jszip-utils>

(c) 2014-2019 Stuart Knightley, David Duponchel
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip-utils/master/LICENSE.markdown.

*/
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JSZipUtils = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/*globals Promise */
// just use the responseText with xhr1, response with xhr2.
// The transformation doesn't throw away high-order byte (with responseText)
// because JSZip handles that case. If not used with JSZip, you may need to
// do it, see https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
function _getBinaryFromXHR(xhr) {
    // for xhr.responseText, the 0xFF mask is applied by JSZip
    return xhr.response || xhr.responseText;
}
// taken from jQuery
function createStandardXHR() {
    try {
        return new window.XMLHttpRequest();
    }
    catch (e) { }
}
function createActiveXHR() {
    try {
        return new window.ActiveXObject("Microsoft.XMLHTTP");
    }
    catch (e) { }
}
// Create the request object
var createXHR = (typeof window !== "undefined" && window.ActiveXObject) ?
    /* Microsoft failed to properly
     * implement the XMLHttpRequest in IE7 (can't request local files),
     * so we use the ActiveXObject when it is available
     * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
     * we need a fallback.
     */
    function () {
        return createStandardXHR() || createActiveXHR();
    } :
    // For all other browsers, use the standard XMLHttpRequest object
    createStandardXHR;
function getBinaryContent(path, options) {
    var callback = typeof options === 'object'
        // callback inside options object
        ? options.callback
        // backward compatible callback or undefined callback (when call async)
        : options;
    var progress = typeof options === 'object' ? options.progress : undefined;
    var promise;
    var resolve = function (data) { callback === null || callback === void 0 ? void 0 : callback(null, data); };
    var reject = function (err) { callback === null || callback === void 0 ? void 0 : callback(err, null); };
    if (!callback && typeof Promise !== "undefined") {
        promise = new Promise(function (_resolve, _reject) {
            resolve = _resolve;
            reject = _reject;
        });
    }
    /*
     * Here is the tricky part : getting the data.
     * In firefox/chrome/opera/... setting the mimeType to 'text/plain; charset=x-user-defined'
     * is enough, the result is in the standard xhr.responseText.
     * cf https://developer.mozilla.org/En/XMLHttpRequest/Using_XMLHttpRequest#Receiving_binary_data_in_older_browsers
     * In IE <= 9, we must use (the IE only) attribute responseBody
     * (for binary data, its content is different from responseText).
     * In IE 10, the 'charset=x-user-defined' trick doesn't work, only the
     * responseType will work :
     * http://msdn.microsoft.com/en-us/library/ie/hh673569%28v=vs.85%29.aspx#Binary_Object_upload_and_download
     *
     * I'd like to use jQuery to avoid this XHR madness, but it doesn't support
     * the responseType attribute : http://bugs.jquery.com/ticket/11461
     */
    try {
        var xhr_1 = createXHR();
        xhr_1.open('GET', path, true);
        // recent browsers
        if ("responseType" in xhr_1) {
            xhr_1.responseType = "arraybuffer";
        }
        // older browser
        if (xhr_1.overrideMimeType) {
            xhr_1.overrideMimeType("text/plain; charset=x-user-defined");
        }
        xhr_1.onreadystatechange = function () {
            // use `xhr` and not `this`... thanks IE
            if (xhr_1.readyState === 4) {
                if (xhr_1.status === 200 || xhr_1.status === 0) {
                    try {
                        resolve(JSZipUtils._getBinaryFromXHR(xhr_1));
                    }
                    catch (err) {
                        reject(new Error(err));
                    }
                }
                else {
                    reject(new Error("Ajax error for " + path + " : " + this.status + " " + this.statusText));
                }
            }
        };
        xhr_1.onprogress = function (event) {
            progress === null || progress === void 0 ? void 0 : progress({
                path: path,
                originalEvent: event,
                percent: event.loaded / event.total * 100,
                loaded: event.loaded,
                total: event.total
            });
        };
        xhr_1.send();
    }
    catch (e) {
        reject(new Error(e));
    }
    // returns a promise or undefined depending on whether a callback was
    // provided
    return promise;
}
var JSZipUtils = {
    _getBinaryFromXHR: _getBinaryFromXHR,
    getBinaryContent: getBinaryContent
};
// export
module.exports = JSZipUtils;
// enforcing Stuk's coding style
// vim: set shiftwidth=4 softtabstop=4:

},{}]},{},[1])(1)
});
