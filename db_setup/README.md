This utility uses Python ^3.7

I recommend using a virtual environment. A poetry project file is available.

The main use at this time is to build and load a database with STIX data.

build_db.py - Working script that can build a database and recursively run through a directory of STIX files or load an STIX individual file.
    - Usage: 
    
    python build_db.py --dbname=<database_name> --path=<filepath | dirpath> | --destroy

The destroy flag tells the system to destroy the database with dbname flag.

# INSTALL
This has been tested on OrientDB v3.0.31 with Python 3.7.7 and poetry version 1.0.10.

```bash
git clone https://github.com/idaholab/STIG.git
cd STIG/db_setup
poetry shell
poetry install
export ORIENT_HOST=<ip of database>
export ORIENT_PORT=2424
export ORIENT_USER=<user>
export ORIENT_PASS=<password>
python build_db.py --dbname=ExampleDB --path=/path/to/STIX/file(s) --destroy
```

# TODO:
* Test stix_loader/models/v20 and v21 for missing schemas. - Add Core as Superclass to all other V.
* Test stix validator before submitting to DB?  Or rely on schem in stix_loader..
* Eliminate unused dependencies.
X Ended up removing gremlin queries entirely and working directly with pyorient OGM.  Test tinkerpop/gremlin on orientdb v 3.0.x. https://orientdb.com/docs/3.0.x/release/3.0/Available-Packages.html.  Doesn't work with current version of pyorient.
* Dedup - mostly done within insert_bundles function.  More testing needed
* Add in multiprocessing
