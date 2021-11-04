// meteor package file

var packageJson = JSON.parse(Npm.require("fs").readFileSync('package.json'));

Package.describe({
  name: 'maxkfranz:weaver',
  version: packageJson.version,
  summary: packageJson.description,
  git: packageJson.repository.url,
  documentation: 'README.md'
});

Package.onUse(function(api) {
  //api.versionsFrom('1.0');
  api.export('weaver');
  api.addFiles([
    'dist/weaver.js',
    'export.js'
  ]);
});

Package.onTest(function(api) {
  api.use('maxkfranz:weaver');
  api.use('tinytest');
  api.addFiles('test-meteor.js');
});
