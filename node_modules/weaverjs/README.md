# Weaver.js

[![JS.ORG](http://img.shields.io/badge/js.org-weaver-ffb400.svg?style=flat-square)](http://js.org)
[![Build Status](http://travis-ci.org/maxkfranz/weaver.svg?branch=master)](https://travis-ci.org/maxkfranz/weaver)



## Documentation

You can find the documentation and downloads on the [project website](http://weaver.js.org).

If you're looking to get an old version of the library, you can build off the associated tag.  We very strongly recommend you use the latest version.  If you run into a bug on the latest version, report it on [the issue tracker](https://github.com/maxkfranz/weaver/issues).  We'll try to fix the bug as soon as possible, and we'll give you a snapshot build that includes the fix for you to use until the next official bugfix release.




## Contributing to Weaver.js

Please refer to [CONTRIBUTING.md](CONTRIBUTING.md).




## Build dependencies

Install `npm` and `gulp`.  Of course, `npm install` before using `gulp`.




## Build instructions

Run `gulp` in the console.  The main targets are:

**Building:**
 * `build` : build the library
 * `zip` : build the release ZIP
 * `clean` : clean the `build` directory
 * `dist` : update the distribution JS for npm, bower, etc.

**File references:**
 * `refs` : update all refs
  * `testrefs` : update JS lib file refs in the tests page
  * `testlist` : update list of test JS files in tests page

**Testing:**
 * `test` : run the Mocha unit tests
 * `lint` : lint the JS sources via jshint
 * `watch` : update JS refs in HTML files (debug page, test page) automatically when JS files are added or deleted

**Documentation:**
 * `docs` : build the documentation template
 * `docsmin` : build the documentation template with all resources minified
 * `docspub` : build the documentation for publishing (ZIPs, JS refs, etc.)
 * `docspush` : push the built documentation to production




## Release instructions

 1. Update the `VERSION` environment variable, e.g. `export VERSION=1.2.3`
 1. Confirm `VERSION` is picked up by gulp: `gulp version`
 1. Confirm JS files pass linting: `gulp lint`
 1. Confirm all tests passing: `gulp test`
 1. Build and publish the release: `gulp publish`


## Tests

Mocha tests are found in the [test directory](https://github.com/cytoscape/weaver.js/tree/master/test).  The tests can be run in the browser or they can be run via Node.js (`gulp test`).
