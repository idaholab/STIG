Building STIG on Linux (Debian based)
======================================
These steps were tested on Ubuntu 18.04 and 20.04.

Install Depedencies 
^^^^^^^^^^^^^^^^^^^
Run some updates and install dependencies:

.. code-block:: bash

  sudo apt update && sudo apt upgrade

  sudo apt-get install build-essential libssl-dev apt-transport-https git curl wget

NVM and Node.js
^^^^^^^^^^^^^^^
Check the NVM Github releases https://github.com/creationix/nvm/releases
and replace v0.38.0 with the latest version. 

Install NVM using the install script:

.. code-block:: bash

  curl https://raw.githubusercontent.com/creationix/nvm/v0.38.0/install.sh | bash


Close and reopen your terminal. Check the NVM version to verify the install

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
^^^^^^
Install the latest stable release of yarn, see https://yarnpkg.com/lang/en/docs/install/#debian-stable for more information.

In a terminal, type:

.. code-block:: bash

  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -

  echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

  sudo apt-get update

  sudo apt-get install --no-install-recommends yarn


RPM Build
^^^^^^^^^^
(Option 1) If you are building an **rpm file** from **ubuntu**, install rpm:

.. code-block:: bash

  sudo apt-get install rpm


(Option 2) If you **only** need a deb, change the following lines in package.json:

_Before..._

.. code-block:: bash

  "linux": [
    "deb",
    "rpm"
  ]


_Updated.._

.. code-block:: bash

  "linux": [
    "deb"
  ]

Proceed to :ref:`Connecting to the Database`