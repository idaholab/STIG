Menu Options 
===============

Graph Dropdown
^^^^^^^^^^^^^^^^^^^^^^
- Toggle on/off STIX relationships
- Toggle on/off certain STIX embedded relationships.
- Clear the graph

Edit Menu
^^^^^^^^^^^^^^^^^^^^^^
- Copy/Cut/Paste objects within the application. This may present limited uses.
- Select all objects
- Deselect all objects currently selected and select all objects currently unselected

Layout Menu
^^^^^^^^^^^^^^^^^^^^^^
The layout menu includes a number of built in typical graph layout options such as dagre, breadthfirst and concentric. In addition, users can layout by a timeline of STIX observed-data objects and STIX attack-patterns.
Adding new nodes will always adjust the layout unless the user selects **-Freeform/Manual-**. 

Import Menu
^^^^^^^^^^^^^^^^^^^^^^
Provides for importing `STIX bundle <https://oasis-open.github.io/cti-documentation/stix/walkthrough#-stix-bundle>`_ JSON files into STIG

Export Menu
^^^^^^^^^^^^^^^^^^^^^^

- Export selected elements to a STIX JSON bundle.
- Export all elements to a STIX JSON bundle.
- Export all elements and their positions to a STIX JSON bundle.

If the option ``All w/Positions`` is selected, later bringing the exported file into STIG will auto position all the objects and their relationships in the exact position they were exported in. This file is not valid STIX and will fail any validation.
