Menu Options 
===============

File Menu
^^^^^^^^^^^^^^^^^^^^^^
Quit the application.

Edit Menu
^^^^^^^^^^^^^^^^^^^^^^
The edit menu allows for common copy/paste of textual data and a ``Configure`` database dropdown.

Layout Menu
^^^^^^^^^^^^^^^^^^^^^^
The layout menu includes a number of built in typical graph layout options such as dagre, breadthfirst and concentric.

Graph Menu
^^^^^^^^^^^^^^^^^^^^^^
The graph menu includes the ability to select all elements, copy/cut/paste elements to the graph pane as well as commit/delete from the database. 

Lastly, we have an ``Export...`` dropdown that allows for: 
- ``Selected elements...`` export the selected elements to a valid STIX bundle.
- ``Export graph..`` export all graph elements to a valid STIX bundle.
- ``Export positions...`` export a positions file for all elements present in the graph pane in JSON format.
- ``All elements w/positions`` export all elements and their positions on the graph pane in a single, non-valid STIX bundle.

To use the saved positions file, we have to have the exact objects/file that created the positions file in our graph pane, and we can drag-and-drop the positions.json file on top of the graph which executes the auto positioning funcationality. 
This is useful for any time a user positions objects on the graph in a way that makes sense to them, and wants to come back to the specific STIX bundle later to edit further or show it off.

If the option to save all elements w/positions is selected, then a simple drag-and-drop of the json output to STIG graph pane will auto position all the objects and their relationships. This file is not valid STIX and will fail any validation.

View Menu
^^^^^^^^^^^^^^^^^^^^^^
Common web application view options such as toggle developer tools, reload the application and more.