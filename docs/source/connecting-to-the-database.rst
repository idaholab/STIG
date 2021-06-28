Connecting to the Database 
===========================

Populating the Database
^^^^^^^^^^^^^^^^^^^^^^^
If desired, populate the database (with the `MITRE ATT&CK STIX 2.0 <https://github.com/mitre/cti>`_ repository with the following commands:

* First, edit the PATH portion of the IMPORT DATABASE command held in {STIG_HOME}/db_setup/import_db.txt.
* This will require an absolute path to the import_db.txt file.
* Also edit the database name, username and password (currently set as ``stig`` ``root`` ``admin``) within the same text file.

Linux:

Import provided STIX data by running the following command:

.. code-block:: bash

    sudo /opt/orientdb/bin/console.sh ./import_db.txt


Windows:

In PowerShell run the following command from the provided stig_build/db_setup directory:

.. code-block:: powershell

    /{STIG_HOME}/orientdb/bin/console.bat` `./import_db.txt


OrientDB CLI Reference: https://orientdb.com/docs/last/admin/Export-to-and-Import-from-JSON.html

