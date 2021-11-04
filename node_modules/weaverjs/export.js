// weaver.js makes `weaver` global on the window (or global) object, while Meteor expects a file-scoped global variable
weaver = this.weaver;
delete this.weaver;
