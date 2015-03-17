---
title: "getBinaryContent(path, callback)"
layout: default
section: api
---

__Description__ : Use an AJAX call to fetch a file (HTTP GET) on the server
that served the file. Cross domain requests will work if the browser support
[them](http://caniuse.com/cors) but only if the server send the
[right headers](https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS).
This function doesn't follow redirects : currently only `200 OK` are accepted.

__Arguments__

name     | type     | description
---------|----------|------------
path     | String   | the path to the resource to GET.
callback | function | the callback function.
progress | function | the progress function.

The callback function has the following signature : `function (err, data) {...}` :


name | type               | description
-----|--------------------|------------
err  | Error              | the error, if any.
data | ArrayBuffer/String | the data in a format suitable for JSZip.

The data can be parsed by [JSZip#load](http://stuk.github.io/jszip/#doc_load_data_options)
or used with [JSZip#file](http://stuk.github.io/jszip/#doc_file_name_data_options)
to add a new file. With `JSZip#file` use `{binary:true}` as options.


The progress function has the following signature : `function (e) {...}` :


name | type               | description
-----|--------------------|------------
e    | ProgressEvent      | indicates some kind of progress.

The e has the following attributes:

The **lengthComputable** attribute must return the value it was initialized to. When an event is created the attribute must be initialized to false.
The **loaded** and **total** attributes must return the value they were initialized to. When an event is created the attributes must be initialized to 0.

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

// listening download progress
JSZipUtils.getBinaryContent("path/to/file.zip", function (err, data) {
   if(err) {
      throw err; // or handle the error
   }
   var zip = new JSZip(data);
}, function(e) {
    if (e.lengthComputable) {
      console.log(e.loaded / e.total);
    }
});
```


