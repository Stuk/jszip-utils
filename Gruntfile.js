/*jshint node: true */
"use strict";

module.exports = function(grunt) {
  // https://wiki.saucelabs.com/display/DOCS/Platform+Configurator
  // A lot of the browsers seem to time out with Saucelab's unit testing
  // framework. Here are the browsers that work that get enough coverage for our
  // needs.
  var browsers = [
    {browserName: "chrome"},
    {browserName: "firefox", platform: "Linux"},
    {browserName: "internet explorer"}
  ];

  var tags = [];
  if (process.env.TRAVIS_PULL_REQUEST && process.env.TRAVIS_PULL_REQUEST != "false") {
    tags.push("pr" + process.env.TRAVIS_PULL_REQUEST);
  } else if (process.env.TRAVIS_BRANCH) {
    tags.push(process.env.TRAVIS_BRANCH);
  }

  var postBundleWithLicense = function(err, src, done) {
    if (!err) {
      // add the license
      var license = require('fs').readFileSync('lib/license_header.js');
      done(err, license + src);
    } else {
      done(err);
    }
  };

  grunt.initConfig({
    connect: {
      server: {
        options: {
          base: "",
          port: 8080
        }
      }
    },
    'saucelabs-qunit': {
      all: {
        options: {
          urls: ["http://127.0.0.1:8080/test/index.html?hidepassed"],
          build: process.env.TRAVIS_JOB_ID,
          testname: "qunit tests",
          tags: tags,
          // Tests have statusCheckAttempts * pollInterval seconds to complete
          pollInterval: 2000,
          statusCheckAttempts: 15,
          "max-duration": 30,
          browsers: browsers,
          maxRetries: 2
        }
      }
    },
    jshint: {
      options: {
        jshintrc: "./.jshintrc"
      },
      all: ['./lib/*.js', "Gruntfile.js"]
    },
    browserify: {
      "utils": {
        files: {
          'dist/jszip-utils.js': ['lib/index.js']
        },
        options: {
          standalone: 'JSZipUtils',
          postBundleCB: postBundleWithLicense
        }
      },
      "utils-ie": {
        files: {
          'dist/jszip-utils-ie.js': ['lib/index_IE.js']
        },
        options: {
          postBundleCB: postBundleWithLicense
        }
      }
    },
    uglify: {
      options: {
        report: 'gzip',
        mangle: true,
        output: {
          comments: /^!/
        }
      },
      "jszip-utils": {
        src: 'dist/jszip-utils.js',
        dest: 'dist/jszip-utils.min.js'
      },
      "jszip-utils-ie": {
        src: 'dist/jszip-utils-ie.js',
        dest: 'dist/jszip-utils-ie.min.js'
      }
    }
  });

  grunt.loadNpmTasks("grunt-saucelabs");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // A task to cause Grunt to sit and wait, keeping the test server running
  grunt.registerTask("wait", function() {
    this.async();
  });

  grunt.registerTask("test-local", ["build", "connect", "wait"]);
  grunt.registerTask("test-remote", ["build", "connect", "saucelabs-qunit"]);

  if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
    grunt.registerTask("test", ["jshint", "test-remote"]);
  } else {
    grunt.registerTask("test", ["jshint", "test-local"]);
  }

  grunt.registerTask("build", ["browserify", "uglify"]);
  grunt.registerTask("default", ["jshint", "build"]);
};
