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