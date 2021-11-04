# Contributing to cytoscape-euler

The Euler layout is an open source project, and we greatly appreciate any and all contributions.

This layout will either be bundled with Cytoscape.js itself or Babel will be added to this project.  That means that modern ES2015/ES6 language features can be used.

If you'd like to contribute code to Cytoscape.js but you're not sure exactly what you'd like to implement, take a look at our [current milestones](https://github.com/cytoscape/cytoscape.js-euler/milestones) to see what features we have planned in future --- or anything labelled [`help-wanted`](https://github.com/cytoscape/cytoscape.js-euler/issues?q=is%3Aopen+is%3Aissue+label%3Ahelp%20wanted).  Of course, we also welcome your own ideas.



## Submitting issues

Submit issues or feature requests to the [issue tracker](https://github.com/cytoscape/cytoscape.js-euler/issues).

If you're submitting a bug report, clearly describe the issue.  List the steps necessary to reproduce your issue along with the corresponding code (preferably a JSBin, as that makes the issue less ambiguous and much faster to fix).

Make certain to mention the version (or commit hash) of the library you are using and version of the browser/environment you are using.



## Where to put changes

To propose a change, [fork](https://help.github.com/articles/fork-a-repo/) the repo, make a change, and then submit a [pull request](https://help.github.com/articles/creating-a-pull-request/) so that the proposed changes can be reviewed.



## Code style

Use two spaces for indentation, and single-quoted strings are preferred.  The main thing is to  try to keep your code neat and similarly formatted as the rest of the code.  There isn't a strict styleguide.



## Testing

You can test the layout with the `demo.html` page.  If you have other datasets to test with,  copy `demo.html` (with a name like `demo-foobar.html`) and embed your data in the new file.
