/*global describe, it*/
'use strict';

delete require.cache[require.resolve('../')];

var fs = require('fs');
var es = require('event-stream');
var assert = require('assert');
var Vinyl = require('vinyl');
var derequire = require('../');

describe('gulp-derequire', function () {
    
    it('should produce expected file via buffer', function (done) {
        var stream = derequire();
        var srcFile = new Vinyl({
            path: 'test/fixtures/example.js',
            cwd: 'test/',
            base: 'test/fixtures',
            contents: fs.readFileSync('test/fixtures/example.js')
        });
        var expectedFile = new Vinyl({
            path: 'test/expected/example.js',
            cwd: 'test/',
            base: 'test/expected',
            contents: fs.readFileSync('test/expected/example.js')
        });
        stream.on('error', function(err) {
            assert(err);
            done(err);
        });
        stream.on('data', function (newFile) {
            assert(newFile);
            assert(newFile.contents);
            assert.equal(String(newFile.contents), String(expectedFile.contents));
            done();
        });
        stream.write(srcFile);
        stream.end();
    });

    it('should produce expected file via stream', function (done) {
        var stream = derequire();
        var srcStream = new Vinyl({
            path: 'test/fixtures/example.js',
            cwd: 'test/',
            base: 'test/fixtures',
            contents: fs.createReadStream('test/fixtures/example.js')
        });
        var expectedFile = new Vinyl({
            path: 'test/expected/example.js',
            cwd: 'test/',
            base: 'test/expected',
            contents: fs.readFileSync('test/expected/example.js')
        });
        stream.on('error', function(err) {
            assert(err);
            done();
        });
        stream.on('data', function (newFile) {
            assert(newFile);
            assert(newFile.contents);
            newFile.contents.pipe(es.wait(function(err, data) {
                assert(!err);
                assert.equal(data, String(expectedFile.contents));
                done();
            }));
        });
        stream.write(srcStream);
        stream.end();
    });
    it('it should work with options', function (done) {
        var stream = derequire( [
            {
                from: 'require',
                to: '_derec_'
            },
            {
                from: 'define',
                to: '_defi_'
            }
        ]);
        var srcFile = new Vinyl({
            path: 'test/fixtures/define.require.js',
            cwd: 'test/',
            base: 'test/fixtures',
            contents: fs.readFileSync('test/fixtures/define.require.js')
        });
        var expectedFile = new Vinyl({
            path: 'test/expected/define.require.js',
            cwd: 'test/',
            base: 'test/expected',
            contents: fs.readFileSync('test/expected/define.require.js')
        });
        stream.on('error', function(err) {
            assert(err);
            done(err);
        });
        stream.on('data', function (newFile) {
            assert(newFile);
            assert(newFile.contents);
            assert.equal(String(newFile.contents), String(expectedFile.contents));
            done();
        });
        stream.write(srcFile);
        stream.end();
    });
});
