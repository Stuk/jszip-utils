/*globals Promise */

// just use the responseText with xhr1, response with xhr2.
// The transformation doesn't throw away high-order byte (with responseText)
// because JSZip handles that case. If not used with JSZip, you may need to
// do it, see https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
function _getBinaryFromXHR(xhr: XMLHttpRequest) {
    // for xhr.responseText, the 0xFF mask is applied by JSZip
    return xhr.response || xhr.responseText;
}

// taken from jQuery
function createStandardXHR() {
    try {
        return new window.XMLHttpRequest();
    } catch( e ) {}
}

function createActiveXHR() {
    try {
        return new window.ActiveXObject("Microsoft.XMLHTTP");
    } catch( e ) {}
}

// Create the request object
const createXHR: () => XMLHttpRequest = (typeof window !== "undefined" && window.ActiveXObject) ?
    /* Microsoft failed to properly
     * implement the XMLHttpRequest in IE7 (can't request local files),
     * so we use the ActiveXObject when it is available
     * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
     * we need a fallback.
     */
    function() {
    return createStandardXHR() || createActiveXHR();
} :
    // For all other browsers, use the standard XMLHttpRequest object
    createStandardXHR;

type CallbackData = string | ArrayBuffer;

type GetBinaryContentCallback = (err: null | Error, data: null | CallbackData) => void;

interface GetBinaryContentProgressData {
    path: string;
    originalEvent: ProgressEvent;
    percent: number;
    loaded: ProgressEvent['loaded'];
    total: ProgressEvent['total'];
}

type GetBinaryContentProgress = (data: GetBinaryContentProgressData) => void;

type GetBinaryContentOptions = {
    callback: GetBinaryContentCallback;
    progress?: GetBinaryContentProgress;
};

/**
 * @param  {string} path    The path to the resource to GET.
 * @param  {function|{callback: function, progress: function}} options
 * @return {Promise|undefined} If no callback is passed then a promise is returned
 */
function getBinaryContent(path: string, options?: never): Promise<CallbackData>;
function getBinaryContent(path: string, options: GetBinaryContentCallback | GetBinaryContentOptions): void;
function getBinaryContent(path: string, options?: GetBinaryContentCallback | GetBinaryContentOptions): Promise<CallbackData> | void {
    const callback = typeof options === 'object'
        // callback inside options object
        ? options.callback
        // backward compatible callback or undefined callback (when call async)
        : options;

    const progress = typeof options === 'object' ? options.progress : undefined;

    let promise: Promise<CallbackData> | undefined;

    let resolve = (data: CallbackData) => { callback?.(null, data); };
    let reject = (err: Error) => { callback?.(err, null); };
    if (!callback && typeof Promise !== "undefined") {
        promise = new Promise((_resolve, _reject) => {
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
        const xhr = createXHR();

        xhr.open('GET', path, true);

        // recent browsers
        if ("responseType" in xhr) {
            xhr.responseType = "arraybuffer";
        }

        // older browser
        if(xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }

        xhr.onreadystatechange = function () {
            // use `xhr` and not `this`... thanks IE
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    try {
                        resolve(JSZipUtils._getBinaryFromXHR(xhr));
                    } catch(err) {
                        reject(new Error(err));
                    }
                } else {
                    reject(new Error("Ajax error for " + path + " : " + this.status + " " + this.statusText));
                }
            }
        };

        xhr.onprogress = (event) => {
            progress?.({
                path: path,
                originalEvent: event,
                percent: event.loaded / event.total * 100,
                loaded: event.loaded,
                total: event.total
            });
        };

        xhr.send();

    } catch (e) {
        reject(new Error(e));
    }

    // returns a promise or undefined depending on whether a callback was
    // provided
    return promise;
}

const JSZipUtils = {
    _getBinaryFromXHR,
    getBinaryContent,
};

// export
module.exports = JSZipUtils;

// enforcing Stuk's coding style
// vim: set shiftwidth=4 softtabstop=4:
