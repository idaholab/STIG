#!/usr/bin/env python3
import pathlib
import sys
import pytz
import datetime
import uuid
import traceback
import os
import argparse
import time
from stix_loader.models.v21.stixmodels import *
from stix_loader.odbbuilder import class_from_json
import pyorient.ogm.property as odbproperty
from pyorient.ogm.broker import *
from pyorient.ogm.batch import *
from pyorient.ogm import Config, Graph
from pyorient.ogm.declarative import declarative_node, declarative_relationship
from stix2.utils import format_datetime, parse_into_datetime
from typing import List, Dict, Optional
from tqdm import tqdm
import logging
from multiprocessing import Pool

MANDATORY_ENV_VARS = ["ORIENT_HOST", "ORIENT_USER", "ORIENT_PASS", "ORIENT_PORT"]

# Logging Levels include: Critical, Error, Warning, Info, Debug, and Noset
FORMAT = '%(message)s'
logging.basicConfig(stream=sys.stderr, level=logging.ERROR, format=FORMAT)

def usage():
    print('Usage: python build_db.py --dbname <database_name> --path <filepath | dirpath> | <--keep>')

def get_datetime() -> str:
    """Get date time
    :rtype: str
    """
    now = datetime.datetime.now(tz=pytz.UTC)
    return format_datetime(parse_into_datetime(now, precision='millisecond'))

#TODO: Modify to use a config file possibly.
def db_setup(HOST: str, USER: str, dbname: str, PASSW: str, PORT: str):#, keep: bool):
    """sets up database
    :param HOST: OGM Graph ref
    :param USER: OGM Graph ref
    :param dbname: OGM Graph ref
    :param PASSW: OGM Graph ref
    :param PORT: OGM Graph ref
    :param keep: boolean value to keep or destroy database
    """
    clear_database=''
    g = Graph(Config.from_url(dbname, USER, PASSW, initial_drop=False))
    SchemaNode=declarative_node()
    SchemaRelationship=declarative_relationship()
    classes_from_schema=g.build_mapping(SchemaNode, SchemaRelationship, auto_plural=True)
    g.include(classes_from_schema)

    g.client.command("ALTER DATABASE DATETIMEFORMAT \"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'\"")

    return g


def format_stix_to_db(stix_objs: List[Dict]) -> List[Dict]:
    """
    Returns a list of stix objects formatted for the DB, also moves relationships to the end of the list
    to make
    :type stix_objs: List[Dict]
    :rtype: List[Dict]
    """
    db_stix: List[Dict] = []
    relations: List[Dict] = []
    for obj in stix_objs:
        if obj['type'] == 'observed-data':
            if 'objects' in obj and isinstance(obj['objects'], list):
                obj['object_refs'] = []
                for o in obj['objects']:
                    o['id_'] = f'{o["type"]}--{uuid.uuid4()}'
                    obj['object_refs'] = o['id_']
                    logging.debug(o)
                    db_stix.insert(0, o)
            try:
                del obj['objects']
            except KeyError:
                logging.info("\nKey Error:\nError while trying to delete objects field. It doesn't exist so can't delete it. Moving on.\n")
        _ob = {}
        for prop, val in obj.items():
            if prop == 'id':
                _ob['id_'] = val
            elif prop == 'objects':
                _ob['objects_'] = val
            elif prop in ['created', 'modified', 'last_seen', 'first_seen', 'valid_from', 'valid_until',
                          'first_observed',
                          'last_observed', 'published']:

                #hacky way to fix incorrectly formatted STIX times
                correct_format = True
                try:
                    datetime.datetime.strptime(val, '%Y/%m/%dT%H:%M:%SZ')
                except ValueError:
                    correct_format = False

                if not val or len(val) == 0 or correct_format == False:
                    now = datetime.datetime.now(tz=pytz.UTC)
                    _ob[prop] = format_datetime(parse_into_datetime(now, precision='millisecond'))
                else:
                    _ob[prop] = format_datetime(
                            parse_into_datetime(val, precision='millisecond'))
            # elif prop == 'objects':
            #     _ob['objects_'] = json.dumps(val)
            else:
                _ob[prop] = val
        if _ob['type'] != 'relationship':
            db_stix.append(_ob)
        else:
            relations.append(_ob)
    return db_stix + relations

def check_mandatory_props(klass: pyorient.ogm.declarative.DeclarativeMeta, obj: Dict):
    """
    Checks schema for required STIX properties. Does not fail on missing property.
    :param klass: ogm representation of V & E class.
    :rtype: Dict
    """
    missing = []
    props = klass.objects.g.props_from_db[klass](Graph.compute_all_properties(klass))
    for k, v in props.items():
        prop = getattr(klass, k)
        if hasattr(prop, 'mandatory'):
            if prop.mandatory and k not in obj:
                # Fix values if default set 
                if k == "revoked":
                    obj[k] = False
                    continue
                if k == "spec_version":
                    obj[k] = "2.1"
                    continue
                missing.append(k)
                if isinstance(prop, odbproperty.String):
                    obj[k] = 'added_default'
                elif isinstance(prop, (odbproperty.Date, odbproperty.DateTime)):
                    obj[k] = get_datetime()
                elif isinstance(prop, odbproperty.EmbeddedList):
                    obj[k] = ['added_default']
                elif isinstance(prop, odbproperty.Integer):
                    obj[k] = 0
                elif isinstance(prop, odbproperty.Float):
                    obj[k] = 0.0
                elif isinstance(prop, odbproperty.Binary):
                    obj[k] = 0
                elif isinstance(prop, odbproperty.Byte):
                    obj[k] = 0
                elif isinstance(prop, odbproperty.Decimal):
                    obj[k] = 0.0
                elif isinstance(prop, odbproperty.Long):
                    obj[k] = 0
                elif isinstance(prop, odbproperty.Short):
                    obj[k] = 0
                elif isinstance(prop, odbproperty.Boolean):
                    obj[k] = True
                else:
                    logging.info(f'What to do with missing mandatory field {k} of type {v.__class__}?')
    if missing:
        logging.info(f'missing mandatory fields for {obj["id_"]}: {missing}')
    return obj

#TODO: I think replacing '-' in SDOs like attack-pattern might break things on STIG
def insert_bundle(g: Graph, stix_objs: List[Dict], bundle_name:str):
    """Insert bundle into OrientDB graph. Tested on v3.0.31
    :param g: OGM Graph ref
    :param id: STIX Node id_
    """
    objects = format_stix_to_db(stix_objs)

    o: Dict
    batch = g.batch()
    for o in tqdm(objects, bundle_name):
        o['bundle_ref'] = bundle_name #delete this 
        logging.debug("\nObject:")
        logging.debug(o)

        # Set up type variables
        o_type = o['type']
        if '-' in o_type:
            o_type = o_type.replace('-', '')

        o_id = o['id_']

        id_type = o_id.strip().split('--')[0]
        _uuid = o_id.strip().split('--')[1]

        class_name = id_type.replace('-', '')

        # o['type']  = object type from type field
        # o_type     = o['type'] without any dashes
        # id_type    = type from identifier 
        # class_name = type from identifier without any dashes
        # If the type indicated by the ID doesn't match the type given explicity by the object field, update the uuid and type variables appropriately
        # (To be consistent with stix standard)
        if o_type != class_name:
            logging.warning(f"Node with different types: {o_type} and {class_name}, setting id to match intended type")
            o['id_'] = o['type'] + '--' + _uuid 
            o_id = o['id_']
            id_type = o['type']
            class_name = id_type.replace('-', '')

        # Check to see if node already exists
        if class_name in g.registry:
            klass = g.registry[class_name]

            #TODO: Ensure that edges associated with this node are also skipped
            try:
                if len(g.query(klass).filter(klass.id_.endswith(_uuid) & (klass.id_.startswith(id_type)))):
                    logging.info(f"Object with id: {o_id} found, moving to next object")
                    continue
            except Exception as e:
                logging.error("Error checking for node")
                logging.error(e)
                logging.error(traceback.format_exc())

        # Add Node
        if o['type'] != 'relationship': 
            # Ensure class is in graph registry and that the batch has an appropriate broker
            if o_type in g.registry:
                klass = g.registry[o_type]
            else:
                logging.warning(f'Stix Object of type {o["type"]} not in g.registry.')
                try:
                    klass = class_from_json(o.copy(), g)
                    batch.objects[klass] = BatchBroker(get_broker(klass)) # VertexBroker(g=g, element_cls=klass)
                    logging.warning(f'Created DB class {klass}!')
                except Exception as e:
                    logging.error('Exception creating DB class')
                    logging.error(e)
                    logging.error(traceback.format_exc())
                    logging.error('\n')

            # Add node to batch
            try:
                klass = g.registry[o_type]
                o = check_mandatory_props(klass, o)
                batch[o['id_'].replace('-','')] = batch.objects[klass].create(**o)
                #res = klass.objects.create(**o)
            except Exception as e:
                logging.error('Error Inserting:')
                logging.error(o)
                logging.error(e)
                logging.error(traceback.format_exc())
                logging.error('\n')

        # Add Edge
        else: 
            # Ensure class is in graph registry and that the batch has an appropriate broker
            r_type = o['relationship_type'].replace('-', '_')
            if r_type not in g.registry: # If not in db, try to create relationship class
                logging.warning(f'Stix Relationship of type {r_type} not in g.registry.')
                try:
                    klass = class_from_json(o.copy(), g)
                    batch.objects[klass] = BatchBroker(get_broker(klass)) # EdgeBroker(g=g, element_cls=klass)
                    logging.warning(f'Created DB relationship class {klass}!')
                except Exception as e: # Rare exception, most likely a db connection issue
                    logging.error(f'Exception creating DB relationship class for {o}')
                    logging.error(e)
                    logging.error(traceback.format_exc())

            # TODO: Double check that duplicate relationships aren't added
            # TODO: Sort this exception out -- why is this being thrown when the objects do exist?
            # Add relationship to batch (shouldn't recreate repeats)
            try:
                source_ref = batch[:o['source_ref'].replace('-','').replace('_','')]
                target_ref = batch[:o['target_ref'].replace('-','').replace('_','')]
            except KeyError as e:
                logging.warning(e)
                logging.warning(f"Source or target ref missing for edge ({bundle_name}): {o['id_']}")
                continue

            try:
                klass = g.registry[r_type]
                o = check_mandatory_props(klass, o)
                # #res = g.create_edge(klass, src, target, **o)
                batch[:] = batch.objects[klass].create(source_ref, target_ref, **o)
            except KeyError as e:
                logging.warning(f"Key Error for edge ({bundle_name}): {o['id_']}")
            except Exception as e:
                logging.error(e)
                #logging.error(traceback.format_exc())
    try:
        batch.commit()
    except Exception as e:
        logging.error(f"\nERROR COMMITTING {bundle_name}, check file for errors\n")



#TODO: Error handling on args
#TODO: Add in logging for exceptions
if __name__ == '__main__':

    if not len(sys.argv) >= 3:
        logging.debug(sys.argv)
        usage()
    else:
        for var in MANDATORY_ENV_VARS:
            if var not in os.environ:
                raise EnvironmentError("Failed because {} is not set.".format(var))

        # Required environment variables
        HOST = os.environ['ORIENT_HOST']
        USER = os.environ['ORIENT_USER']
        PASSW = os.environ['ORIENT_PASS']
        PORT = int(os.environ['ORIENT_PORT'])

        # Parse command line arguments
        # Note: keep allows us to skip objects we've already seen, but doens't allow us to update. All or nothing. 
        parser = argparse.ArgumentParser()
        parser.add_argument('--dbname', help='Database name')
        parser.add_argument('--path', help='path to directory/json file')
        parser.add_argument('--destroy', help='Flag for keeping/destroying database', action='store_true', default=False)
        parser.add_argument('--remove', help='Remove JSON files once loaded; helpful on first load with messy data', action='store_true', default=False)
        args = parser.parse_args()

        # Setup database connection
        #graph = db_setup(HOST, USER, args.dbname, PASSW, PORT, args.keep)
        if args.destroy:
            clear_database = input('Are you sure you want to delete the database? (Y/N):  ')
            if clear_database in ['Y', 'y', 'Yes', 'yes', 'YES']:
                print('(dropping database)\n')
                g = Graph(Config.from_url(args.dbname, USER, PASSW, initial_drop=True))
                g.create_all(Node.registry)
                g.create_all(Relationships.registry)

        def process_file(p):
            graph = db_setup(HOST, USER, args.dbname, PASSW, PORT)#, args.keep)
            with open(p, 'r', encoding = "ISO-8859-1") as f: # Allow ISO-8859-1 encoding to avoid unicode errors 
                logging.debug('\n\n***********************************************************')
                logging.debug('adding file: {}'.format(p))
                # irl = f.readlines()
                try:
                    # Load json file
                    irl = json.load(f)
                    # Weed out any objects that aren't formatted correctly (sometimes strings cloud the data) and add bundle name to nodes 
                    for o in irl['objects']:
                        if type(o) == dict:
                            o['bundle_ref'] = p.name
                        else:
                            logging.error(f"Bad object in file {p.name}, removing from file")
                            irl['objects'].remove(o)
                            continue
                    # Insert bundle into graph db
                    insert_bundle(graph, irl['objects'], p.name)
                except Exception as e: # Not expecting any errors that haven't been caught elsewhere. If one is caught, exit right away.
                    logging.error(f"Error in file: {p.name}")
                    logging.error(e)
                    logging.error(traceback.format_exc())
            # Remove files as you load them? 
            if args.remove:
                os.remove(p)

        infiles=args.path
        path = pathlib.Path(infiles)
        if path.is_dir(): # Loading a directory
            print(f"Parsing the following {len(list(path.glob('**/*.json')))} files: ")
            # Print files that will be parsed
            for f in list(path.glob('**/*.json')):
                print("  - ", f.name)

            # Loop through jsons in pool 
            process_pool = Pool(1) 
            _ = list(tqdm(process_pool.map(process_file, list(path.glob('**/*.json'))), 'Files'))
                
        else: # Only loading one file, not a directory
            with open(path, 'r', encoding = "ISO-8859-1") as f:
                logging.debug('\n\n***********************************************************')
                logging.debug('adding file: {}'.format(infiles))
                # Load file and insert into bundle. Less error catching here since it's a single file 
                try:
                    irl = json.load(f)
                    insert_bundle(graph, irl['objects'], infiles)
                except Exception as e:
                    logging.error(e)
                    logging.error(traceback.format_exc())

        print('DONE!')
        # TODO: Ensure program exists 
