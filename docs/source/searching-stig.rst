Searching STIG 
===============

Searching the Database
^^^^^^^^^^^^^^^^^^^^^^
STIG supports SQL and Gremlin queries against the database. Any objects matching the query will be added to the graph. The main constraint in your queries is to make sure your query returns STIX objects. ``select from malware`` will display all malware objects, ``select count(*) from malware`` does nothing.

The reference for SQL queries is at: https://orientdb.com/docs/2.2.x/SQL.html.

The reference for Gremlin queries is at: https://orientdb.com/docs/2.2.x/Gremlin.html#create-a-new-vertex. The initial parts about getting started and opening a database can be disregarded, just put your gremlin query into the "Query Database" box.

To see the structure of the database go to: http://db_server:2480/studio/index.html, select the name of the database you configured in the STIG database configuration, and enter your credentials. The database schema is designed to adhere as closely to the JSON schemas of STIX as possible, Vertices in the database are STIX Data Objects, Edges in the database are STIX Relationship Objects. Two caveats:

- "id" is reserved in OrientDB so the ID property of is stored as "id\_"

- Any property with a dash (-) must be escaped with back ticks in a SQL query. Only some of the STIX Object type names are afflicted by this. For example "select from \`attack-pattern\`"

Graph Searches
^^^^^^^^^^^^^^
Objects and relationships in the displayed graph can be searched using this box. Presently this search supports searches of the format property:value. Property is any STIX property such as type, name, id, created, source_ref, etc. For example:

``type:attack-pattern`` will find and select all objects of type "attack-pattern".

``relationship_type:targets`` will find and select all relationships of the type "targets".

In the future this search capability could be expanded to allow regular expressions, cytoscape selectors, etc.

STIG Query Cheetsheet
^^^^^^^^^^^^^^^^^^^^^
.. note:: These queries only work if there is a database with the information saved inside.

Selecting Malware by Name
----------------------------

.. code-block:: SQL

    select from malware where name.toLowerCase() like '%blackcoffee%'

.. note:: the % in the query is a way to define regular expressions in SQL LIKE queries (it's not necessarily needed for this query). A more specific example would be to use '%coffee' would return all strings that end with coffee.

Selecting Attack-Pattern by Name
--------------------------------

.. code-block:: SQL

    select from `attack-pattern` where name == 'DLL Side-Loading'

.. note:: must use of the the `left` tick marks(tilde key) surrounding attack-pattern

Traversing Returned Results
--------------------------------

.. code-block:: SQL

    traverse * from (select from malware)

Selecting Malware by name and traversing both directions
---------------------------------------------------------

.. code-block:: SQL
    
    traverse both() from (select from malware where name.toLowerCase() like '%blackcoffee%') while $depth < 2

Continuing traversal from previous results
------------------------------------------

.. code-block:: SQL

    traverse out() from (traverse both() from (select from malware where name.toLowerCase() like '%blackcoffee%') while $depth < 2)

Intrusion Sets and Malware objects related to a certain Attack Pattern - Process Discovery
-----------------------------------------------------------------------------------------------

.. code-block:: SQL

    traverse in() from (select from V where name like '%Process%' ORDER BY modified DESC limit 1) while $depth < 2

Intrusion Sets and Attack Patterns Using Certain Tools
--------------------------------------------------------

.. code-block:: SQL

    traverse * from (select from Tool where name like '%netsh%' ORDER BY modified DESC limit 1) while $depth < 2

Gremlin - Get Vertices of type Malware
----------------------------------------

.. code-block:: SQL

    g.V('type', 'malware').out.path.scatter

Gremlin - Get all Vertices of Attack Pattern 'Rootkit'
-------------------------------------------------------

.. code-block:: SQL

    g.V().has('name','Rootkit').in().path.scatter

Gremlin - Get all 'Threat Actors' and Malware associated with them
--------------------------------------------------------------------

.. code-block:: SQL

    g.V().has('type','malware').in().path.scatter

SQL - Selecting all elements related to a command-and-control step
------------------------------------------------------------------

.. code-block:: SQL

    SELECT FROM V WHERE 'command-and-control' in kill_chain_phases.phase_name

SQL - Selecting all elements from the lockheed kill chain on the installation phase
-------------------------------------------------------------------------------------------------

.. code-block:: SQL

    SELECT FROM V WHERE 'lockheed' in kill_chain_phases.kill_chain_name AND 'installation' in kill_chain_phases.phase_name