var test = require('tap').test,
    eventify = require('..');

test('Eventify protects your object', function(t) {
   t.plan(1);
   try {
     var subject = eventify({
       on: "I'm a dummy string, please don't wipe me out"
     });
   } catch (e) {
     t.ok(true, 'Eventify should thrown an exception to protect your object');
   }
   t.end();
});
