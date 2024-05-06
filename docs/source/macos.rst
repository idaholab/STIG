Building STIG for Macos
========================

This section was tested on macOS Catalina.

Everything here can be installed manually or through Homebrew: https://brew.sh/

Node.js
^^^^^^^^^^^^^^^
Download the latest LTS version for macOS
https://nodejs.org/en/download/

If using Homebrew:

.. code-block:: bash

    brew install node

Yarn
^^^^^^^^^^^^^
Install the latest stable release of yarn: https://yarnpkg.com/lang/en/docs/install/#mac-stable.

If using Homebrew:

.. code-block:: bash

    brew install yarn

    brew upgrade yarn

Potential ``gyp`` Error
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Some users on macOS Catalina 10.15.2 have had this error when running the ``yarn install`` command:

``gyp: No Xcode or CLT version detected!``

To resolve this, follow the steps outlined here: https://medium.com/flawless-app-stories/gyp-no-xcode-or-clt-version-detected-macos-catalina-anansewaa-38b536389e8d

Specifically, 

.. code-block:: bash

    xcode-select --reset

Followed by a complete reinstall of CLT if necessary.

Proceed to :ref:`Connecting to the Database`