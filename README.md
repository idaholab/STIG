# STIG – Structured Threat Intelligence Graph

Version 1.0.0

Structured Threat Intelligence Graph (STIG)  is a tool for creating, editing, querying, analyzing and visualizing threat intelligence.  It uses STIX version 2 as its data format.  STIG uses a graph database (OrientDB) to store the data.

See the [STIG Innovation Sheet](18-179_STIG_Innovation_Sheet.pdf) for an overview.

The STIX version 2 specification can be found at **<http://docs.oasis-open.org/cti/stix/v2.0/stix-v2.0-part1-stix-core.html>**.
An introduction and walk through of STIX can be found at **<https://oasis-open.github.io/cti-documentation/stix/intro.html>**, and **<https://oasis-open.github.io/cti-documentation/stix/walkthrough.html>**.

## Disclaimer

- Structured Threat Intelligence Graph (STIG) is open sourced for the purpose of providing a repeatable and sharable platform for structured threat information.  The California Energy Systems for the 21st Century (CES-21) program funded by the California Public Utility Commission (CPUC) created many capabilities to meet the connected nature of the electric grid for the State of California.  The CPUC has granted permission to release STIG to the open source community to promote potential uses beyond CES-21.
- STIG does not assess the quality of threat information.  The quality of the threat information gathered and modified is based on the source of that threat information.
- STIG does not provide executable detection and response.  STIG output may be used in other detection and response technologies if those technologies digest Structured Threat Information eXpression (STIX) 2.0.  Integration with other detection and response technologies is not part of STIG.
- STIG can support extensions to the STIX data structures with the creation of a new database instance to include those structures.  These STIX extensions may not be supported in other STIX compliant technologies.
- Advanced programming scripts can be created or may exist inside a STIX data object that is represented in the STIG views and database.  These scripts are not tested through STIG or STIX validation.  These scripts, if used, are to be integrated at the implementer’s risk.

## Getting Started

The following dependencies need to be installed before STIG can be compiled:

- Java Development Kit (JDK)
- OrientDB
- NVM
- Node.js
- Yarn
- Git

### For Ubuntu 16.04 LTS (Debian Flavors)

#### Java Development Kit

Download Java 8:
**<http://www.oracle.com/technetwork/java/javase/overview/index.html>**

`sudo apt-get install software-properties-common`

`sudo add-apt-repository ppa:webupd8team/java`

`sudo apt-get update`

`sudo apt-get install oracle-java8-installer`

#### OrientDB

The following commands are the easiest way to install OrientDB:

`wget https://orientdb.com/download.php?file=orientdb-community-2.2.23.tar.gz -O orientdb.tar.gz`

`sudo tar zxvf orientdb.tar.gz -C /opt`

NOTE: that the version number can change, revisions 2.2.23 or greater are known to work.  Versions 3.0 or greater have not been tested.

We recommend starting the server to see if everything is working correctly and set our root password.  Run the following command:

`sudo /opt/orientdb/orientdb/bin/server.sh`

This will prompt you for the root password for your OrientDB setup.
To stop the server:

`sudo /opt/orientdb/orientdb/bin/shutdown.sh`

##### Optional:

Another alternative is to use the community provided docker image.  Documentation for this can be found at: **<https://github.com/docker-library/docs/tree/master/orientdb>**.

If you want to configure OrientDB to run as a service:
**<https://orientdb.com/docs/last/>**

#### NVM (Node Version Manager)

In a terminal, type:

`sudo apt-get update`

`sudo apt-get install build-essential libssl-dev apt-transport-https curl`

Check for the latest NVM version <https://github.com/creationix/nvm/releases>
At the time of writing, the latest version was 0.33.11
Install NVM using the install script

`curl https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`

Close and reopen your terminal. Check the NVM version to verify the install

`nvm --version`

#### Node.js

Install the latest version of Node.js. In a terminal, type:

`nvm install node`

#### Yarn

Install the latest stable release of yarn, see **<https://yarnpkg.com/lang/en/docs/install/#debian-stable>** for more information.

In a terminal, type:

`curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`

`echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`

`sudo apt-get update`

`sudo apt-get install --no-install-recommends yarn`

#### Git

In a terminal, type:

`sudo apt-get install git`

### For CentOS 7 (RHEL Flavors)

#### Java Development Kit

NOTE: The following section has been tested on CentOS after changing the default OpenJDK Java to Oracle's Java 8 using instructions from the following link:

**<https://www.digitalocean.com/community/tutorials/how-to-install-java-on-centos-and-fedora>**

#### OrientDB

NOTE: The following link is an excellent writeup on how to install and configure OrientDB for CentOS7. As mentioned above, these install instructions were using Oracle's Java 8 so some of these commands don't relate to the setup we were using. The link also defines how to run OrientDB as a service:

**<https://www.vultr.com/docs/how-to-install-and-configure-orientdb-community-edition-on-centos-7>**

#### NVM

Install development tools and related libraries:

`sudo yum group install "Development Tools"`

`sudo yum install gettext-devel openssl-devel perl-CPAN perl-devel zlib-devel`

Check for the latest NVM version <https://github.com/creationix/nvm/releases>
At the time of writing, the latest version was 0.33.11
Install NVM using the install script

`curl https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`

Close and reopen your terminal. Check the NVM version to verify the install

`nvm --version`

#### Node.js

`nvm install node`

#### Yarn

`curl -o- -L https://yarnpkg.com/install.sh | bash`

#### Git

`sudo yum install git`

### For MacOS

Everything here can be installed manually or through Homebrew: <https://brew.sh/>

#### Java Development Kit

Mac doesn't ship with Java so if it's not already installed head over to:
**<http://www.oracle.com/technetwork/java/javase/overview/index.html>**

These instructions are using Java SE 8u172

#### OrientDB

Download the community edition of OrientDB from **<http://www.orientdb.com>**. Install according to the instructions. Version 2.2.36 is known to work.

Alternative methods are to use the community provided docker image: **<https://github.com/docker-library/docs/tree/master/orientdb>**

Configure OrientDB to run as a service:
**<https://orientdb.com/docs/2.1.x/Unix-Service.html>**

- `alias orientdb-server=/path/to/$ORIENTDB_HOME/bin/orientdb.sh`
- `orientdb-server start`

This daemon will have to be restarted after the machine boots up.

- `$ alias orientdb-console=/path/to/$ORIENTDB_HOME/bin/console.sh`
- `orientdb-console`

If using Homebrew:

- `brew install orientdb`
- `brew services start orientdb`

#### Node.js

Download the latest LTS version for macOS
**<https://nodejs.org/en/download/>**

If using Homebrew:

`brew install node`

#### Yarn

Install the latest stable release of yarn: **<https://yarnpkg.com/lang/en/docs/install/#mac-stable>**.

If using Homebrew:

`brew install yarn --without-node`
`brew upgrade yarn`

#### Git

In a terminal, type:

`git --version`

If Git is not already installed, it will prompt you to install it.

### For Windows

These instructions have been tested on Windows 7.  Further confirmation is needed for Windows 10.
   **(Testing on Windows 10: no problems so far)**

#### Java Development Kit

Download version 8 of the Java SE Platform (OrientDB has issues with the newest version 10.0.1):
   **(Need to sign-in/create account at Oracle in order to download)**

**<http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html>**.

#### OrientDB

Download the community edition of OrientDB from **<https://orientdb.com/>**.  Install according to the instructions.  You will see a warning about information being sent over an insecure connection.  Use version 2.2, revisions 2.2.23 or greater are known to work. Versions 3.0 or greater have not been tested.  Another alternative is to use the community provided Docker image.  Documentation for this can be found at: **<https://github.com/docker-library/docs/tree/master/orientdb>**.
   **(Testing on latest version 3.0.30: no problems so far)**

Some instructions after you download OrientDB:

1) Move the un-tarred OrientDB directory to somewhere like C:/
2) Start the server by executing {ORIENTDB_HOME}/bin/server.bat.
3) Select the password you want to assign the "root" user. This is only needed the first time running OrientDB from the terminal.
4) To Open Studio Web Tool, navigate a browser to the URL: **<http://localhost:2480>**.
5) You could also use the console by executing {ORIENTDB_HOME}/bin/console.bat.
6) Create a database to use (default for the following installer scripts is currently stig2).
      **(The name of the database should be stig or stig2?)**
7) Optional: Populating the Database... see Important Notes about Database Setup section below.

To configure OrientDB to run as a service. See:
**<https://orientdb.com/docs/2.1.x/Unix-Service.html>**.

#### Node.js

Download and install the latest LTS version from: **<https://nodejs.org/en/download/>**.

You will want to update npm after node is downloaded to avoid issues later with dependencies and security holes.
Run the following command in PowerShell:

`npm i npm@latest -g`

#### Yarn

Download the latest stable `.msi` installer from
 **<https://yarnpkg.com/lang/en/docs/install/#windows-stable>**.

#### Git

Download the latest Git client from **<https://git-scm.com/download/win>**

## Important Notes about Database Setup

The default configuration looks for a database called "stig" being served off of localhost.  If you have never used the application before, this database is not correctly configured.

For ease of use, there are some options depending on your Operating System:
 (Note: These instructions all assume an OrientDB name: root and password: admin - you can manually edit these depending on which option you choose to use).

1. Linux: Do not create a database at all, and run the following script that will do it all for you:
    `cd {STIG_HOME}/stig_build/db_setup`

    `export ORIENTDB_HOME=/opt/orientdb`

    `export PATH=$PATH:$ORIENTDB_HOME/bin`

    `./setup.sh`

    - This will automatically populate the database named: stig
    - Run the application and follow the instructions following these next line items
    - This script auto populates the database with provided STIX data referenced below
2. Create a database manually through the console or the OrientDB Studio:

    - Note: You shouldn't create any classes in the database at this time. Instead, run the application and follow the instructions referenced below
3. Do not create a database and let the application create one for you:
    - Open the Application and navigate to: Edit -> Configure -> Database
    - Enter a new database name and then follow the instructions referenced below

From inside the application, you will be able to configure the database you want to use:

Configure the parameters as required for your OrientDB server and click "Save".  The version described in these instructions sets a username of 'root' and password of '<your_chosen_password>' as the 'root' user.

On the next dialog you will be able to select the radio button for the database you wish to use, and click the "Use" button to enable that database configuration.  This configuration will be remembered the next time you use the application. If done correctly, the application will create and load all necessary classes and allow you to use the application.

### Populating Database

If desired, you can populate the database (with the MITRE ATT&CK STIX 2.0repository) with the following commands:

- First, edit the PATH portion of the IMPORT DATABASE command held in {STIG_HOME}/db_setup/import_db.txt.
- This will require an absolute path to the import_db.txt file.
- You will also need to edit the database name, username and password (currently set as 'stig ' 'root' 'admin') within the same text document.

The data provided with the following command is from the following source: **<https://github.com/mitre/cti>**

Linux:

 Import provided STIX data by running the following command:

`sudo /opt/orientdb/bin/console.sh ./import_db.txt`

Windows:

 In PowerShell run the following command from the provided stig_build/db_setup directory:

`/{STIG_HOME}/orientdb/bin/console.bat` `./import_db.txt `

OrientDB CLI Reference: **<https://orientdb.com/docs/last/admin/Export-to-and-Import-from-JSON.html>**

## To Build An Executable

Download and extract the stig.tar archive. Navigate to the extracted files. From a terminal in this directory run:

`yarn install`

`yarn make`

   **(Got errors when using both commands, downloaded python and got rid of one error)**

The package(s) for your platform will be found in "out/make/".  The contents of the package(s) can be examined in "out/STIG-{platform}/".

If you wish to run the application without installing the package, the binary can be found in "out/STIG-{platform}/STIG"

## Proxy Issues During Build

npm likes to have its own proxy config, if you have problems with building the code try configuring npm to use your proxy:

`npm config set proxy http://proxy.company.com:8080`

`npm config set https-proxy http://proxy.company.com:8080`

## To Run In Developer Mode

Unarchive the stig.tar file and navigate a terminal to that directory.

Install dependencies, this is only needed the first time, or if you update a dependency:

`yarn install`

`NOTE`:  Some Linux distributions seem to have a problem with `yarn install`.  In this case `npm install` should work. This also requires python to be installed: **<https://www.python.org/downloads/release/python-2713/>**.

Python2.7 must be installed and set to be globally accessible.

Next, make sure the database is running:
If you are using the docker image, make sure the container is started.  If you downloaded the OrientDB distribution, then change to the directory created when the OrientDB tarball (or zip) was expanded. From there run:

`bin/server.sh` or `bin/server.bat`

If you haven't set up the database yet, you will get a prompt to set the root password.  Once completed, leave the terminal running.

Next from another terminal run:

`yarn start`

## Adding Content To STIG

- Drag and Drop a file containing a STIX Bundle **<https://oasis-open.github.io/cti-documentation/stix/walkthrough#-stix-bundle>** from your file manager to the Graph pane of STIG.  If the bundle contains references to STIX objects whose definition is not included in the bundle, STIG will first search its database for an object matching the ID or the missing bundle.  If none are found, STIG will prompt if you wish to add one.  This object will need to have its details filled in by you.

- Drag or click on an icon in the topmost row of the UI.  This will add one instance of the selected object to the graph.  Click on the new item in the graph to edit its details.

- Cut the JSON of a STIX object out of a text editor.  Paste it into STIG using either Graph->Paste elements, or via CTRL/CMD-SHIFT-V.  Likewise you can copy the JSON of displayed elements by selecting them and using Graph->Copy Selected Elements or CTRL/CMD-SHIFT-C.

- Create relationships by hovering over an object in the graph, then dragging from the small red box to the other object.  When the target object's border turns purple release the mouse to complete the relationship.

- OrientDB's Web app, SQL console interface, or available API's can be used to do bulk inserts.

- Objects that are either differ or absent from the database will have their labels highlighted yellow.  The "Diff" button will display a diff of the displayed object's details vs the database version.  Items not present in the diff have no equivalent in the database.

## Database Queries

STIG supports SQL and Gremlin queries against the database.  Any objects matching the query will be added to the graph.  The main constraint in your queries is to make sure your query returns STIX objects.  `"select from malware"` will display all malware objects, `select count(*) from malware` does nothing.

The reference for SQL queries is at: **<https://orientdb.com/docs/2.2.x/SQL.html>**.

The reference for Gremlin queries is at: **<https://orientdb.com/docs/2.2.x/Gremlin.html#create-a-new-vertex>**.  The initial parts about getting started and opening a database can be disregarded, just put your gremlin query into the "Query Database" box.

To see the structure of the database go to: **<http://db_server:2480/studio/index.html>**, select the name of the database you configured in the STIG database configuration, and enter your  credentials.  The database schema is designed to adhere as closely to the JSON schemas of STIX as possible, Vertices in the database are STIX Data Objects, Edges in the database are STIX Relationship Objects.  Two caveats:

- "id" is reserved in OrientDB so the ID property of is stored as "id_"

- Any property with a dash (-) must be escaped with back ticks in a SQL query. Only some of the STIX Object type names are afflicted by this.  For example "select from \`attack-pattern\`"

## Search Graph

Objects and relationships in the displayed graph can be searched using this box.  Presently this search supports searches of the format property:value.  Property is any STIX property such as type, name, id, created, source_ref, etc.  For example:

`type:attack-pattern` will find and select all objects of type "attack-pattern".

`relationship_type:targets` will find and select all relationships of the type "targets".

In the future this search capability could be expanded to allow regular expressions, cytoscape selectors, etc.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Copyright and License

See the file COPYRIGHT.txt and LICENSE.txt
