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
