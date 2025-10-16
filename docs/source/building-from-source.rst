Building from Source
=====================

Regardless of the operating system used, the following are required dependencies for STIG:

* Node.js
* NPM (node package manager)


The following instructions detail how to get the dependencies for STIG:

Linux and macOS
^^^^^^^^^^^^^^^^

.. code-block:: bash

  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.40.1/install.sh | bash
  source ~/.bashrc
  nvm install node

Windows
^^^^^^^^

.. code-block:: powershell
   # Download and install fnm:
   winget install Schniz.fnm
   # Download and install Node.js:
   fnm install 22
   # Verify the Node.js version:
   node -v # Should print "v22.13.1".
   # Verify npm version:
   npm -v # Should print "10.9.2".


Run STIG
^^^^^^^^^

Once all the dependencies are installed, users can clone and run STIG:

.. code-block:: bash
   git clone https://github.com/idaholab/STIG.git
   cd STIG/
   npm install
   npm run dev # or 'npm run dev -- --host' to expose the port