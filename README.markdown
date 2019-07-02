JSZipUtils
==========

A collection of cross-browser utilities to go along with JSZip, see
http://stuk.github.io/jszip-utils for all the documentation.

It has two parts, one for every browsers and one for IE < 10. To use it :

```html
<script type="text/javascript" src="dist/jszip-utils.js"></script>
<!--
Mandatory in IE 6, 7, 8 and 9.
-->
<!--[if IE]>
<script type="text/javascript" src="dist/jszip-utils-ie.js"></script>
<![endif]-->
```

Development
-----------

Run `npm test` to lint, build, and launch a server at http://localhost:8080/test/ . Open the page in a browser to verify that the tests are passing.

If you have a Saucelabs account set the `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY`environment variables to test remotely.

License
-------

JSZipUtils is dual-licensed. You may use it under the MIT license *or* the GPLv3
license. See LICENSE.markdown.
