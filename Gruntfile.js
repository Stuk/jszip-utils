/*jshint node: true */
module.exports = function(grunt) {
  var browsers = [{
      browserName: "iphone",
      platform: "OS X 10.8",
      version: "6"
  }, {
      browserName: "android",
      platform: "Linux",
      version: "4.0"
  }, {
      browserName: "firefox",
      platform: "XP"
  }, {
      browserName: "chrome",
      platform: "XP"
  }, {
      browserName: "internet explorer",
      platform: "WIN8",
      version: "10"
  }, {
      browserName: "internet explorer",
      platform: "VISTA",
      version: "9"
  }, {
      browserName: "internet explorer",
      platform: "Windows 7",
      version: "8"
  }, {
      browserName: "internet explorer",
      platform: "XP",
      version: "7"
  }, {
      browserName: "opera",
      platform: "Windows 2008",
      version: "12"
  }, {
      browserName: "safari",
      platform: "OS X 10.8",
      version: "6"
  }];

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
                  port: 9999
              }
          }
      },
      'saucelabs-qunit': {
          all: {
              options: {
                  urls: ["http://127.0.0.1:9999/test/index.html"],
                  tunnelTimeout: 5,
                  build: process.env.TRAVIS_JOB_ID,
                  concurrency: 3,
                  browsers: browsers,
                  testname: "qunit tests",
                  tags: tags
              }
          }
      },
      jshint: {
            options: {
                jshintrc: "./.jshintrc"
            },
            all: ['./lib/*.js']
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
        preserveComments: 'some'
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

  if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
    grunt.registerTask("test", ["connect", "saucelabs-qunit"]);
  } else {
    grunt.registerTask("test", []);
  }
  grunt.registerTask("build", ["browserify", "uglify"]);
  grunt.registerTask("default", ["jshint", "build"]);
};
