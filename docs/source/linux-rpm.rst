Building STIG on Linux (RPM based)
===================================
These instructions were tested on a Fedora 33 system.

Dependencies 
^^^^^^^^^^^^
Update Fedora and install the following dependecies:

.. code-block:: bash

    sudo dnf update
    sudo dnf install git curl wget
    sudo dnf install java-11-openjdk


Install development tools and related libraries:

.. code-block:: bash

    sudo yum group install "Development Tools"

    sudo yum install gettext-devel openssl-devel perl-CPAN perl-devel zlib-devel

NVM and Node.js
^^^^^^^^^^^^^^^^^
Install NVM using the install script

.. code-block:: bash

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.37.2/install.sh | bash


Close and reopen your terminal. Check the NVM version to verify the install.

.. code-block:: bash

    nvm --version


Check for and install the latest LTS (as of this writing it was 14.16.0):

.. code-block:: bash

    nvm ls-remote

    nvm install 14.16.0


Install Node:

.. code-block:: bash

    nvm install node

Yarn
^^^^^^^^^^^^
Install yarn:

.. code-block:: bash

    curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
    curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -

    sudo dnf install yarn

OrientDB
^^^^^^^^^

The following commands are the easiest way to install OrientDB into /opt directory:

.. code-block:: bash

    wget https://s3.us-east-2.amazonaws.com/orientdb3/releases/3.0.32/orientdb-3.0.32.tar.gz -O orientdb.tar.gz

    sudo tar -zxvf orientdb.tar.gz -C /opt


Start the server and set your root password:

.. code-block:: bash

    sudo /opt/orientdb-3.0.32/bin/server.sh


To stop the server:

.. code-block:: bash

    sudo /opt/orientdb-3.0.32/bin/shutdown.sh

Installing OrientDB as a Service 
----------------------------------
In a terminal, issue the following command:

.. code-block:: bash

    sudo useradd -r orientdb -s /sbin/nologin
    sudo chown -R orientdb:orientdb /opt/orientdb-3.0.32

You will need to make a few changes to the `orientdb.sh` script. Open the file using your favorite text editor.

.. code-block:: bash

    sudo vim /opt/orientdb-3.0.32/bin/orientdb.sh 

Change the directory and user as follows:

.. code-block:: bash

    ORIENTDB_DIR="/opt/orientdb"
    ORIENTDB_USER="orientdb"

Save and close the file. Copy the systemd service ``sudo cp /opt/orientdb-3.0.32/bin/orientdb.service /etc/systemd/system``.

Make the following changes - modify the User, Group, and ExecStart commands:

.. code-block:: bash

    sudo vim /etc/systemd/system/orientdb.service 

    [Service]
    User=orientdb
    Group=orientdb
    ExecStart=/opt/orientdb/bin/server.sh

Save and close the file. Restart the daemon: ``sudo systemctl daemon-reload``.

Start the service and enable it on boot:

.. code-block:: bash

    sudo systemctl start orientdb 
    sudo systemctl enable orientdb 

Proceed to :ref:`Connecting to the Database`