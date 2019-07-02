'use strict';

/**
 * This is an helper function to transform the input into a binary string.
 * The transformation is normaly handled by JSZip.
 * @param {String|ArrayBuffer} input the input to convert.
 * @return {String} the binary string.
 */
function toString(input) {
    var result = "",
        i, len, isArray = (typeof input !== "string");

    if (isArray) {
        input = new Uint8Array(input);
    }

    for (i = 0, len = input.length; i < len; i++) {
        result += String.fromCharCode(
            (isArray ? input[i] : input.charCodeAt(i)) % 0xFF
        );
    }

    return result;
}

QUnit.module("callback");

QUnit.test("JSZipUtils.getBinaryContent, text, 200 OK", function (assert) {
    var done = assert.async();
    var p = JSZipUtils.getBinaryContent("ref/amount.txt", function (err, data) {
        assert.equal(err, null, "no error");
        assert.equal(toString(data), "\xe2\x82\xac\x31\x35\x0a", "The content has been fetched");
        done();
    });
    assert.strictEqual(p, undefined, 'not return promise');
});

QUnit.test("JSZipUtils.getBinaryContent, image, 200 OK", function (assert) {
    var done = assert.async();
    var p = JSZipUtils.getBinaryContent("ref/smile.gif", function (err, data) {
        assert.equal(err, null, "no error");
        assert.equal(toString(data).indexOf("\x47\x49\x46\x38\x37\x61"), 0, "The content has been fetched");
        done();
    });
    assert.strictEqual(p, undefined, 'not return promise');
});

QUnit.test("JSZipUtils.getBinaryContent, 404 NOT FOUND", function (assert) {
    var done = assert.async();
    var p = JSZipUtils.getBinaryContent("ref/nothing", function (err, data) {
        assert.equal(data, null, "no error");
        assert.ok(err instanceof Error, "The error is an Error");
        done();
    });
    assert.strictEqual(p, undefined, 'not return promise');
});



QUnit.module("options={callback}");

QUnit.test("JSZipUtils.getBinaryContent, text, 200 OK", function (assert) {
    var done = assert.async();
    var p = JSZipUtils.getBinaryContent("ref/amount.txt", {
        callback: function (err, data) {
            assert.equal(err, null, "no error");
            assert.equal(toString(data), "\xe2\x82\xac\x31\x35\x0a", "The content has been fetched");
            done();
        }
    });
    assert.strictEqual(p, undefined, 'not return promise');
});

QUnit.test("JSZipUtils.getBinaryContent, image, 200 OK", function (assert) {
    var done = assert.async();
    var p = JSZipUtils.getBinaryContent("ref/smile.gif", {
        callback: function (err, data) {
            assert.equal(err, null, "no error");
            assert.equal(toString(data).indexOf("\x47\x49\x46\x38\x37\x61"), 0, "The content has been fetched");
            done();
        }
    });
    assert.strictEqual(p, undefined, 'not return promise');
});

QUnit.test("JSZipUtils.getBinaryContent, 404 NOT FOUND", function (assert) {
    var done = assert.async();
    var p = JSZipUtils.getBinaryContent("ref/nothing", {
        callback: function (err, data) {
            assert.equal(data, null, "no error");
            assert.ok(err instanceof Error, "The error is an Error");
            done();
        }
    });
    assert.strictEqual(p, undefined, 'not return promise');
});

// Guard Promise tests for IE
if (typeof Promise === "undefined") {
    QUnit.module("Promises");
    QUnit.skip("Skipping promise tests");
} else {
    QUnit.module("Promise (no parameters)");

    QUnit.test("JSZipUtils.getBinaryContent amount, text, 200 OK", function (assert) {
        var done = assert.async();
        JSZipUtils.getBinaryContent("ref/amount.txt").then(function (data) {
                assert.equal(toString(data), "\xe2\x82\xac\x31\x35\x0a", "The content has been fetched");
                done();
            })
            .catch(function (err) {
                assert.equal(err, null, "no error");
                done();
            });
    });

    QUnit.test("JSZipUtils.getBinaryContent smile, image, 200 OK", function (assert) {
        var done = assert.async();
        JSZipUtils.getBinaryContent("ref/smile.gif").then(function (data) {
            assert.equal(toString(data).indexOf("\x47\x49\x46\x38\x37\x61"), 0, "The content has been fetched");
            done();
        }).catch(function (err) {
            assert.equal(err, null, "no error");
            done();
        });
    });

    QUnit.test("JSZipUtils.getBinaryContent nothing, 404 NOT FOUND", function (assert) {
        var done = assert.async();
        JSZipUtils.getBinaryContent("ref/nothing").then(function (data) {
            assert.equal(data, null, "no error");
            done();
        }).catch(function (err) {
            assert.ok(err instanceof Error, "The error is an Error");
            done();
        });
    });

    QUnit.module("Promise, options={}");

    QUnit.test("JSZipUtils.getBinaryContent amount, text, 200 OK", function (assert) {
        var done = assert.async();
        JSZipUtils.getBinaryContent("ref/amount.txt", {}).then(function (data) {
                assert.equal(toString(data), "\xe2\x82\xac\x31\x35\x0a", "The content has been fetched");
                done();
            })
            .catch(function (err) {
                assert.equal(err, null, "no error");
                done();
            });
    });

    QUnit.test("JSZipUtils.getBinaryContent smile, image, 200 OK", function (assert) {
        var done = assert.async();
        JSZipUtils.getBinaryContent("ref/smile.gif", {}).then(function (data) {
            assert.equal(toString(data).indexOf("\x47\x49\x46\x38\x37\x61"), 0, "The content has been fetched");
            done();
        }).catch(function (err) {
            assert.equal(err, null, "no error");
            done();
        });
    });

    QUnit.test("JSZipUtils.getBinaryContent nothing, 404 NOT FOUND", function (assert) {
        var done = assert.async();
        JSZipUtils.getBinaryContent("ref/nothing", {}).then(function (data) {
            assert.equal(data, null, "no error");
            done();
        }).catch(function (err) {
            assert.ok(err instanceof Error, "The error is an Error");
            done();
        });
    });

    QUnit.module("Promise, options={progress}");

    QUnit.test("JSZipUtils.getBinaryContent amount, text, 200 OK", function (assert) {
        var done = assert.async();
        var progress = assert.async();
        JSZipUtils.getBinaryContent("ref/amount.txt", { progress: function(e){
            assert.ok(true, 'progress to be called');
            assert.strictEqual(e.total, 6, 'total');
            progress();
        }}).then(function (data) {
                assert.equal(toString(data), "\xe2\x82\xac\x31\x35\x0a", "The content has been fetched");
                done();
            })
            .catch(function (err) {
                assert.equal(err, null, "no error");
                done();
            });
    });

    QUnit.test("JSZipUtils.getBinaryContent smile, image, 200 OK", function (assert) {
        var done = assert.async();
        var progress = assert.async();
        JSZipUtils.getBinaryContent("ref/smile.gif", { progress: function(e){
            assert.ok(true, 'progress to be called');
            assert.strictEqual(e.total, 41, 'total');
            progress();
        }}).then(function (data) {
            assert.equal(toString(data).indexOf("\x47\x49\x46\x38\x37\x61"), 0, "The content has been fetched");
            done();
        }).catch(function (err) {
            assert.equal(err, null, "no error");
            done();
        });
    });

    QUnit.test("JSZipUtils.getBinaryContent nothing, 404 NOT FOUND", function (assert) {
        var done = assert.async();

        JSZipUtils.getBinaryContent("ref/nothing", { progress: function(e){

        }}).then(function (data) {
            assert.equal(data, null, "no error");
            done();
        }).catch(function (err) {
            assert.ok(err instanceof Error, "The error is an Error");
            done();
        });
    });
} // Promise tests

// enforcing Stuk's coding style
// vim: set shiftwidth=4 softtabstop=4:
