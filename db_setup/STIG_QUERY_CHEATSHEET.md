## Queries to use with STIG
<!-- These queries only work if there is a database with the information saved inside -->
Depending on when your database was built, queries that include a dash '-' might work or might not.  
ie: attack-pattern vs attackpattern.

### Selecting Malware by Name
`select from malware where name.toLowerCase() like '%blackcoffee%'`

*    note the % in the query is a way to define regular expressions in SQL LIKE queries (it's not necessarily needed for this query). A more specific example would be to use '%coffee' would return all strings that end with coffee.

### Selecting Attack-Pattern by Name
`select from `attack-pattern` where name == 'DLL Side-Loading'`

*    note must use of the the `left` tick marks(tilde key) surrounding attack-pattern

### Traversing Returned Results
`traverse * from (select from malware)`

### Selecting Malware by name and traversing both directions
`traverse both() from (select from malware where name.toLowerCase() like '%blackcoffee%') while $depth < 2`

### Continuing traversal from previous results
`traverse out() from (traverse both() from (select from malware where name.toLowerCase() like '%blackcoffee%') while $depth < 2)`

### Intrusion Sets and Malware objects related to a certain Attack Pattern - Process Discovery
`traverse in() from (select from V where name like '%Process%' ORDER BY modified DESC limit 1) while $depth < 2`

### Intrusion Sets and Attack Patterns Using Certain Tools
`traverse * from (select from Tool where name like '%netsh%' ORDER BY modified DESC limit 1) while $depth < 2`

### Gremlin - Get Vertices of type Malware
`g.V('type', 'malware').out.path.scatter`

### Gremlin - Get all Vertices of Attack Pattern 'Rootkit'
`g.V().has('name','Rootkit').in().path.scatter`

### Gremlin - Get all 'Threat Actors' and Malware associated with them
`g.V().has('type','malware').in().path.scatter`

### SQL - Selecting all elements related to a command-and-control step
`SELECT FROM V WHERE 'command-and-control' in kill_chain_phases.phase_name`

### SQL - Selecting all elements from the lockheed kill chain on the installation phase
`SELECT FROM V WHERE 'lockheed' in kill_chain_phases.kill_chain_name AND 'installation' in kill_chain_phases.phase_name`
