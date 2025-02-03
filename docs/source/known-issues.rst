Known Issues 
=============

Custom STIX Extensions
^^^^^^^^^^^^^^^^^^^^^^
STIG has been modified using custom STIX extensions. These extensions bring more functionality to STIG but may cause exported STIX bundles to fail the `Oasis STIX validator <https://github.com/oasis-open/cti-stix-validator>`_.

Infrastructure Object `infrastructure-type-ov`
-----------------------------------------------
STIG was modified to accept the following additional infrastructure-type-ov vocab entries:

* firewall -- Device that inspects network traffic, and restricts is based upon defined policies
* workstation -- General machine used for work by an organization that needs protection.
* infrastructure -- routers/switches
* control-system -- such as IoT, HMI, RTU, PLC or other ICS devices.

These modifications allows user to represent Defender Infrastructure in STIX.

Unhandled Promise Rejection
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. image:: unhandled-promise-rejection.jpg

An Unhandled Promise Rejection error can occur after running the STIG installation or executable if Neo4j is not installed and running. To clear this error, make sure Neo4j is installed/running and connected to STIG (Edit -> Configure menu).

Database Issues 
^^^^^^^^^^^^^^^^^^^^^^^^^^^
* A commit to the database does not check for duplicate objects.
* The `build_db.py` script has connection issues when the database is on a remote server. The script works fine with a locally hosted database.
* STIG needs to be connected to a database before manupulating a graph. If the user connects to a database after working on a STIG graph, the graph will be cleared when the database connects.

Layout Issues
^^^^^^^^^^^^^^^
* There can be issues with the ``Cose-Bilkent`` layout not settling properly - can cause subsequent layout changes to not work correctly.
* Switching layouts from ``Spread`` to ``Grid`` rapidly (back and forth) can cause subsequent layouts to not render properly.

Other Issues 
^^^^^^^^^^^^^^^
* Missing functionality with portions of the File menu.
* `payload_bin` spec compliance: payload_bin includes extra data that isn't spec compliant. When you create an observed-data with an Artifcat object, and you drop some data into it, the json snip looks like: ``"payload_bin": "data:image/png;base64;iVBO"``. Everything before the **iVBO** should bot be included as base64 data.
* All other issues are listed on the `STIG github <https://github.com/idaholab/STIG/issues>`_ site.