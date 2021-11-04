'use strict';

Tinytest.add('Weaver.init', function(test){
  test.ok(weaver.thread() != null, 'nonnull');
});
