Building STIG for Windows
==========================

These instructions have been tested on Windows 10 (version 20H2).

Java Development Kit (JDK)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Download openjdk 11 zip file from the following site:

https://download.java.net/java/GA/jdk11/9/GPL/openjdk-11.0.2_windows-x64_bin.zip

Unzip the file to the ``C:\Program Files\Java\`` folder. You should end up with a `jdk-11` folder at that location.

Add Java to the PATH environment variable:

* Select Control Panel, then System
* Click Advanced System Settings, then Environment Variables
* Add the location of the bin folder you just extracted to the PATH variable
  * Click **New**
  * Enter ``C:\Program Files\Java\jdk-11\bin``
  * Click **OK**

Set Java_Home:
* Under System Variables, click New
* Enter the name as `JAVA_HOME`
* Enter the ``C:\Program Files\Java\jdk-11`` as the variable value.
* Click **OK**

OrientDB
^^^^^^^^^^^

Download the community edition of OrientDB from: https://s3.us-east-2.amazonaws.com/orientdb3/releases/3.0.32/orientdb-3.0.32.zip. 

Some instructions after you download OrientDB:

1) Move the un-zipped OrientDB directory to somewhere like C:/
2) Start the server by executing the following in Command Prompt: ``{ORIENTDB_HOME}/bin/server.bat``
3) Select the password you want to assign the "root" user. This is only needed the first time running OrientDB from the terminal.
4) To Open Studio Web Tool, navigate a browser to the URL: http://localhost:2480.
5) You could also use the console by executing ``{ORIENTDB_HOME}/bin/console.bat``.
6) Create a database to use (default for the following installer scripts is currently stig2).
7) Optional: Populating the Database... see Important Notes about Database Setup section below.

Install OrientDB as a Service 
--------------------------------
Follow the instructions `here <http://orientdb.com/docs/3.0.x/admin/Windows-Service.html>`_ to install OrientDB as a service.

Node.js
^^^^^^^^^^
Download and install the latest LTS version from: https://nodejs.org/en/download/.

You will want to update npm after node is downloaded to avoid issues later with dependencies and security holes.
Run the following command in PowerShell:

.. code-block:: powershell

    npm i npm@latest -g

Yarn 
^^^^^^^
Install yarn using the npm package manager. In Powershell, 

.. code-block:: powershell

    npm install --global yarn


Check that yarn is installed by opening Command Propmt and entering:

.. code-block:: powershell

    yarn --version


See the following for reference: https://yarnpkg.com/lang/en/docs/install/#windows-stable.


 .. note:: Default Windows 10 installs do not allow the execution of scripts in Powershell (i.e the `yarn install` command). Users can install STIG using the `npm install` and `npm start` commands if they do not want to change script execution policy.


Git
^^^^^^^
Download and install the latest Git client from https://git-scm.com/download/win.

Proceed to :ref:`Connecting to the Database`