# gulp-derequire

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]


> A [gulp](https://github.com/gulpjs/gulp) plugin for [derequire](https://github.com/calvinmetcalf/derequire).


## Description
`gulp-derequire` is a gulp plugin to apply [derequire](https://github.com/calvinmetcalf/derequire) to target Buffer/Stream. It's useful when you are building standalone module using [browserify](http://browserify.org/) with gulp.


## Usage

First, install `gulp-derequire` as a development dependency:

```shell
npm install --save-dev gulp-derequire
```

Then, add it to your `gulpfile.js`:

```javascript
var derequire = require('gulp-derequire');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('build', function() {
    var bundleStream = browserify({entries: './index.js', standalone: 'yourModule'}).bundle();
    return bundleStream
        .pipe(source('yourModule.js'))
        .pipe(derequire())
        .pipe(gulp.dest('./build'));
});
```

## API

### derequire(parameters)

__Note:__ parameters are passed verbatim to derequire so see [its readme](https://github.com/calvinmetcalf/derequire) for options 

#### customization example

to change both require and define

```javascript
var derequire = require('gulp-derequire');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('build', function() {
    var bundleStream = browserify({entries: './index.js', standalone: 'yourModule'}).bundle();
    return bundleStream
        .pipe(source('yourModule.js'))
        .pipe(derequire([
            {
                from: 'require',
                to: '_dereq_'
            },
            {
                from: 'define',
                to: '_defi_'
            }
        ]))
        .pipe(gulp.dest('./build'));
});
```


## Author

* [Takuto Wada](https://github.com/twada)


## License

Licensed under the [MIT](https://github.com/twada/gulp-derequire/blob/master/MIT-LICENSE) license.


[npm-url]: https://npmjs.org/package/gulp-derequire
[npm-image]: https://badge.fury.io/js/gulp-derequire.svg

[travis-url]: https://travis-ci.org/twada/gulp-derequire
[travis-image]: https://secure.travis-ci.org/twada/gulp-derequire.svg?branch=master

[license-url]: https://github.com/twada/gulp-derequire/blob/master/MIT-LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg
