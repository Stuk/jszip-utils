---
title: "getBinaryContent(path, callback)"
layout: default
section: api
---

__Description__ : Use an AJAX call to fetch a file (HTTP GET) on the server
that served the file. Cross domain requests will work if the browser support
[them](http://caniuse.com/cors) but only if the server send the
[right headers](https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS).
This function doesn't follow redirects: currently only `200 OK` are accepted.

__Arguments__

name     | type               | description
---------|--------------------|------------
path     | String             | the path to the resource to GET.
options  | function or object | A callback function or options object.

The options object has a required `callback` function property and an optional `progress` function property.

The `callback` function has the following signature: `function (err, data) {...}` :

name | type               | description
-----|--------------------|------------
err  | Error              | the error, if any.
data | ArrayBuffer/String | the data in a format suitable for JSZip.

The `progress` function has the following signature: `function (event) {...}`, where `event` has the following properties:

name    | type               | description
--------|--------------------|------------
path    | string             | The path of the file being loaded.
loaded  | number             | the amount of data currently transfered.
total   | number             | the total amount of data to be transferred.
percent | number             | the percent of data currently transfered.

The data can be parsed by [JSZip#load](http://stuk.github.io/jszip/#doc_load_data_options)
or used with [JSZip#file](http://stuk.github.io/jszip/#doc_file_name_data_options)
to add a new file. With `JSZip#file` use `{binary:true}` as options.

__Returns__ : Nothing.

__Throws__ : Nothing.

<!--
__Complexity__ : **O(1)** everywhere but on IE <=9, **O(n)** on IE <=9, n being
the length of the fetched data.
-->

__Example__

```js
// loading a zip file
JSZipUtils.getBinaryContent("path/to/file.zip", function (err, data) {
   if(err) {
      throw err; // or handle the error
   }
   var zip = new JSZip(data);
});

// loading a file and add it in a zip file
JSZipUtils.getBinaryContent("path/to/picture.png", function (err, data) {
   if(err) {
      throw err; // or handle the error
   }
   var zip = new JSZip();
   zip.file("picture.png", data, {binary:true});
});

// loading a zip file with a progress callback
JSZipUtils.getBinaryContent("path/to/file.zip", {
    progress: function (event) {
        console.log(event.percent + "% of " + event.path+ " loaded")
    },
    callback: function (err, data) {
        if(err) {
           throw err; // or handle the error
        }
        var zip = new JSZip(data);
    }
});
```


