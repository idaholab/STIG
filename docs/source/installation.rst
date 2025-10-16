Installation 
=============

There are two ways to install STIG. The recommended way to run STIG is to start the STIG docker container using docker-compose. Users will need Docker and docker-compose installed.
The other option is :ref:`Building from Source`.

Linux (Deb)
^^^^^^^^^^^^

Run the following command in the terminal.

.. code-block:: bash

    sudo apt update
    sudo apt install docker docker-compose
    git clone https://github.com/idaholab/STIG.git
    cd STIG/
    sudo docker-compose up -d

Linux (RPM)
^^^^^^^^^^^^

Run the following command in the terminal.

.. code-block:: bash

    sudo dnf -y install dnf-plugins-core
    sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo systemctl enable --now docker
    git clone https://github.com/idaholab/STIG.git
    cd STIG/
    sudo docker-compose up -d


Windows
^^^^^^^^^
Install Docker Desktop here: https://docs.docker.com/desktop/setup/install/windows-install/.

.. code-block:: bash

    git clone https://github.com/idaholab/STIG.git
    cd STIG/
    sudo docker compose up

Macos
^^^^^^^

Install Docker Desktop here: https://docs.docker.com/desktop/setup/install/mac-install/.

.. code-block:: bash

    git clone https://github.com/idaholab/STIG.git
    cd STIG/
    sudo docker compose up

