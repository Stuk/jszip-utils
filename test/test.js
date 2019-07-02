'use strict';

/**
 * This is an helper function to transform the input into a binary string.
 * The transformation is normaly handled by JSZip.
 * @param {String|ArrayBuffer} input the input to convert.
 * @return {String} the binary string.
 */
function toString(input) {
    var result = "", i, len, isArray = (typeof input !== "string");

    if (isArray) {
        input = new Uint8Array(input);
    }

    for(i = 0, len = input.length; i < len ; i++) {
        result += String.fromCharCode(
            (isArray ? input[i] : input.charCodeAt(i)) % 0xFF
        );
    }

    return result;
}


QUnit.test("JSZipUtils.getBinaryContent with callback, text, 200 OK", function(assert){
    var done = assert.async();
    JSZipUtils.getBinaryContent("ref/amount.txt", function(err, data) {
        assert.equal(err, null, "no error");
        assert.equal(toString(data), "\xe2\x82\xac\x31\x35\x0a", "The content has been fetched");
        done();
    });
});

QUnit.test("JSZipUtils.getBinaryContent with callback, image, 200 OK", function(assert){
    var done = assert.async();
    JSZipUtils.getBinaryContent("ref/smile.gif", function(err, data) {
        assert.equal(err, null, "no error");
        assert.equal(toString(data).indexOf("\x47\x49\x46\x38\x37\x61"), 0, "The content has been fetched");
        done();
    });
});

QUnit.test("JSZipUtils.getBinaryContent with callback, 404 NOT FOUND", function(assert){
    var done = assert.async();
    JSZipUtils.getBinaryContent("ref/nothing", function(err, data) {
        assert.equal(data, null, "no error");
        assert.ok(err instanceof Error, "The error is an Error");
        done();
    });
});

// enforcing Stuk's coding style
// vim: set shiftwidth=4 softtabstop=4:
