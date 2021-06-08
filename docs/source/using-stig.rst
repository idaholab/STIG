Using STIG 
===========
To run the STIG application, navigate to the installed directory (terminal) and run ``yarn start``. Alternatively, if you have built an executable you can click the hyperlinked icon to run STIG.

The ``yarn start`` command will run STIG in `developer mode` which is a live STIG build. Re-running ``yarn start`` will be required any time STIG closes.

Adding Content to STIG 
^^^^^^^^^^^^^^^^^^^^^^

.. image:: importbundle.gif

Drag and Drop 
------------------
- Drag and drop a file containing a STIX bundle (https://oasis-open.github.io/cti-documentation/stix/walkthrough#-stix-bundle) from your file manager to the graph pane of STIG. If the bundle contains references to STIX objects whose definition is not included in the bundle, STIG will first search its database for an object matching the ID or the missing bundle.  If none are found, STIG will prompt if you wish to add one.  This object will need to have its details filled in by you.

- Drag or click on an icon in the topmost row of the UI.  This will add one instance of the selected object to the graph.  Click on the new item in the graph to edit its details.

Copy / Paste 
-----------------
- Cut the JSON of a STIX object out of a text editor.  Paste it into STIG using either Graph->Paste elements, or via CTRL/CMD-SHIFT-V.  Likewise you can copy the JSON of displayed elements by selecting them and using Graph->Copy Selected Elements or CTRL/CMD-SHIFT-C.

Creating Relationships 
----------------------
- Create relationships by hovering over an object in the graph, then dragging from the small red box to the other object.  When the target object's border turns purple release the mouse to complete the relationship.

- OrientDB's Web app, SQL console interface, or available API's can be used to do bulk inserts.

Diff 
----------
- Objects that are either differ or absent from the database will have their labels highlighted yellow.  The "Diff" button will display a diff of the displayed object's details vs the database version.  Items not present in the diff have no equivalent in the database.