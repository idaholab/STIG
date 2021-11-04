var test = require('tap').test,
    expose = require('../');

test('exposes all properties without filter', function (t) {
  var target = {},
      settings = { age: 42, name: 'John' };

  expose(settings, target);

  t.equals(target.age(), 42, 'age() is present and gets value');
  t.equals(target.name(), 'John', 'name() is present and gets value');

  var chained = target.age(24);
  t.ok(chained === target, 'Allows chaining');
  t.equals(target.age(), 24, 'Property is updated');

  t.end();
});

test('exposes only filtered properies whith filter', function (t) {
  var target = {},
      settings = { age: 42, name: 'John' };

  expose(settings, target, ['name']);

  t.ok(target.age === undefined, 'age() should not be present');
  t.equals(target.name(), 'John', 'name() is present and gets value');

  var chained = target.name('Smith');
  t.ok(chained === target, 'Allows chaining');
  t.equals(target.name(), 'Smith', 'Property is updated');

  t.end();
});

test('Ignores when function is present', function (t) {
  var predefinedSetter = function () {},
      target = { name : predefinedSetter },
      settings = { name: 'John' };

  expose(settings, target);

  t.ok(target.name === predefinedSetter, 'name() should not be overriden');
  t.end();
});

test('Ignores prototype', function (t) {
  function Settings() {};
  Settings.prototype.foo = 'Bar';

  var target = {},
      settings = new Settings();

  expose(settings, target);

  t.ok(target.foo === undefined, 'foo() should not be present');
  t.end();
});
