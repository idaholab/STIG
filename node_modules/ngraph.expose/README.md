# ngraph.expose

Adds getters and setters to subeset of object's properties

[![Build Status](https://travis-ci.org/anvaka/ngraph.expose.png?branch=master)](https://travis-ci.org/anvaka/ngraph.expose)

# Example

``` js
var target = {};
var source = { age: 42};

exposeProperties(source, target);

target.age(); // returns 42
target.age(24); // sets source.age to 24;

```

You can also select only subset of properties you want to expose:

``` js
var target = {};
var source = { age: 42, name: 'John'};
exposeProperties(source, target, ['name']);
target.name(); // returns 'John'
target.age === undefined; // true
```

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.expose
```

# license

MIT
