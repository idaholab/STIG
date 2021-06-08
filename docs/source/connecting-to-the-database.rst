Connecting to the Database 
===========================

The recommended method for creating a database is to use STIG. The default configuration looks for a database called "stig" being served off of localhost. If you have never used the application before, this database is not correctly configured.

.. note: Make sure OrientDB is running before attempting to connect STIG to the database.

Navigate to **Edit** / **Configure** / **Database Connection**.

Select **New** to create a new database.

* **Host**: the IP address of the OrientDB server (localhost)
* **Port**: 2424 (API port for OrientDB)
* **Database Name**: Enter a name for the database
* **Database User**: Set a username for the database
* **Database User Password**: Set a password for the database
* **Database Admin**: This is the root user for OrientDB install (root)
* **Database Admin Password**: This is the root password you setup for OrientDB

Click **Save**. Navigate in your browser to `<IP address for OrientDB server>:2480` to view the database in OrientDB Studio. (i.e. `localhost:2480`)

On the next dialog you will be able to select the radio button for the database you wish to use, and click the "Use" button to enable that database configuration. This configuration will be remembered the next time you use the application. If done correctly, the application will create and load all necessary classes and allow you to use the application.

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

