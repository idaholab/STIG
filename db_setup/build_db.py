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
from pyorient.ogm import Config, Graph
from pyorient.ogm.declarative import declarative_node, declarative_relationship
from stix2.utils import format_datetime, parse_into_datetime
from typing import List, Dict, Optional
from tqdm import tqdm
import logging

MANDATORY_ENV_VARS = ["ORIENT_HOST", "ORIENT_USER", "ORIENT_PASS", "ORIENT_PORT"]

# Logging Levels include: Critical, Error, Warning, Info, Debug, and Noset
FORMAT = '%(message)s'
logging.basicConfig(stream=sys.stderr, level=logging.WARNING, format=FORMAT)

def usage():
    print('Usage: python build_db.py --dbname <database_name> --path <filepath | dirpath> | <--keep>')

def get_datetime() -> str:
    """Get date time
    :rtype: str
    """
    now = datetime.datetime.now(tz=pytz.UTC)
    return format_datetime(parse_into_datetime(now, precision='millisecond'))

#TODO: Modify to use a config file possibly.
def db_setup(HOST: str, USER: str, dbname: str, PASSW: str, PORT: str, keep: bool):
    """sets up database
    :param HOST: OGM Graph ref
    :param USER: OGM Graph ref
    :param dbname: OGM Graph ref
    :param PASSW: OGM Graph ref
    :param PORT: OGM Graph ref
    :param keep: boolean value to keep or destroy database
    """
    print('\n(connecting to db)')
    clear_database=''
    if(not keep):
        clear_database = input('Are you sure you want to delete the database? (Y/N):  ')

    if clear_database in ['Y', 'y', 'Yes', 'yes', 'YES']:
        print('(dropping database)\n')
        g = Graph(Config.from_url(dbname, USER, PASSW,initial_drop=True))
        g.create_all(Node.registry)
        g.create_all(Relationships.registry)
    else:
        print('(keeping database)\n')
        g = Graph(Config.from_url(dbname, USER, PASSW, initial_drop=False))
        SchemaNode=declarative_node()
        SchemaRelationship=declarative_relationship()
        classes_from_schema=g.build_mapping(SchemaNode, SchemaRelationship, auto_plural=True)
        g.include(classes_from_schema)

    g.client.command("ALTER DATABASE DATETIMEFORMAT \"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'\"")

    logging.info('Graph object \'g\': ', g)
    return g

#TODO: Rename method, as this should work for both edges and nodes
#TODO: Error handling
def get_node_by_id(g: Graph, id: str) -> Optional[str]:
    """Queries Database for any type--ID
    :param g: OGM Graph ref
    :param id: STIX Node id_
    """
    ret = ''
    try:
        id_type = id.split('--')[0]
        _uuid = id.split('--')[1]


        # if id_type.has
        class_name = id_type.replace('-', '')

        if class_name in g.registry:
            klass = g.registry[class_name]

        queried_proper = g.query(klass).filter(klass.id_.endswith(_uuid) & (klass.id_.startswith(id_type))).one()

        ret = queried_proper
    except Exception as e:
        logging.info('Query Error:')
        logging.info(e)
        logging.info("Error caught while checking to see if node exists... moving along.")
        return None

    if len(ret.id_):
        return ret
    else:
        return None

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
def insert_bundle(g: Graph, stix_objs: List[Dict]):
    """Insert bundle into OrientDB graph. Tested on v3.0.31
    :param g: OGM Graph ref
    :param id: STIX Node id_
    """
    objects = format_stix_to_db(stix_objs)

    o: Dict
    for o in tqdm(objects, 'Objects'):
        logging.debug("\nObject:")
        logging.debug(o)
        o_type = o['type']
        if '-' in o_type:
            o_type = o_type.replace('-', '')

        o_id = o['id_']

        id_type = o_id.strip().split('--')[0]
        _uuid = o_id.strip().split('--')[1]

        class_name = id_type.replace('-', '')

        if class_name in g.registry:
            klass = g.registry[class_name]

        #TODO: Perhaps hit fixed get_node_by_id to to check for object existing.
        try:
            if len(g.query(klass).filter(klass.id_.endswith(_uuid) & (klass.id_.startswith(id_type)))):
            # if len(g.gremlin(f"g.V().has('id_', '{o_id}')")) or len(g.gremlin(f"g.E().has('id_', '{o_id}')")):
                logging.info(f"Object with id: {o_id} found, moving to next object")
                continue
            else:
                if o_type =='relationship':
                    r_type = o['relationship_type'].replace('-', '_')
                    src_id_type = o['source_ref'].strip().split('--')[0]
                    s_id = o['source_ref'].strip().split('--')[1]
                    tar_id_type = o['target_ref'].strip().split('--')[0]
                    t_id = o['target_ref'].strip().split('--')[1]

                    if r_type in g.registry:
                        temp = g.registry[r_type]

                    #Checks all props of a relationship (src/target_refs and id_ to determine of we already have this relationship in the database)
                    #TODO: what if we want to update??  Flag???  If keep and update flag is true, we replace anything currently in the database with the new file?
                    if (len(g.query(temp).filter(klass.id_.endswith(_uuid) & (klass.id_.startswith(id_type))))):
                        if (len(g.query(temp).filter(klass.source_ref.startswith(src_id_type) & (klass.source_ref.endswith(s_id))))):
                            if (len(g.query(temp).filter(klass.target_ref.startswith(tar_id_type) & (klass.target_ref.endswith(t_id))))):
                                logging.info(f"Relationship with id: {o_id} found, moving on to next object")
                                continue

        except Exception as e:
            logging.error('Gremlin Error:')
            logging.error(e)
            logging.error(traceback.format_exc())
            logging.error('\n')
        if o['type'] != 'relationship':
            if o_type in g.registry:
                klass = g.registry[o_type]
            else:
                #logging.info('!' * 40)
                logging.info(f'Stix Object of type {o["type"]} not in g.registry.')
                try:
                    klass = class_from_json(o.copy(), g)
                    logging.info(f'Created DB class {klass}!')
                except Exception as e:
                    logging.error('Exception creating DB class')
                    logging.error(e)
                    logging.error(traceback.format_exc())
                    logging.error('\n')
                #logging.info('!' * 40, '\n')
            try:
                klass = g.registry[o_type]
                o = check_mandatory_props(klass, o)
                res = klass.objects.create(**o)
            except Exception as e:
                logging.error('Error Inserting:')
                logging.error(o)
                logging.error(e)
                logging.error('\n')
        else:
            try:
                src = get_node_by_id(g, o['source_ref'])
                target = get_node_by_id(g, o['target_ref'])
            except KeyError:
                continue

            if not src or not target:
                logging.warning('\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!! \nERROR: Missing node when creating edge')
                logging.warning(f'\tsrc: {src}')
                logging.warning(f'\ttarget: {target}')
                logging.warning("Not Creating Edge")
                logging.warning('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n')
                #return
                continue

            r_type = o['relationship_type'].replace('-', '_')
            if r_type not in g.registry:
                logging.info('!' * 40)
                logging.info(f'Stix Relationship of type {r_type} not in g.registry.')
                try:
                    klass = class_from_json(o.copy(), g)
                    logging.info(f'Created DB relationship class {klass}!')
                    logging.info('!' * 40)
                except Exception as e:
                    logging.error(f'Exception creating DB relationship class for {o}')
                    logging.error(e)
                    logging.error(traceback.format_exc())

                logging.info('!' * 40, '\n')
            klass = g.registry[r_type]
            res = g.create_edge(klass, src, target, **o)

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

        HOST = os.environ['ORIENT_HOST']
        USER = os.environ['ORIENT_USER']
        PASSW = os.environ['ORIENT_PASS']
        PORT = int(os.environ['ORIENT_PORT'])

        parser = argparse.ArgumentParser()
        parser.add_argument('--dbname', help='Database name')
        parser.add_argument('--path', help='path to directory/json file')
        parser.add_argument('--keep', help='Flag for keeping/destroying database', action='store_true', default=False)

        args = parser.parse_args()

        graph = db_setup(HOST, USER, args.dbname, PASSW, PORT, args.keep)

        infiles=args.path
        path = pathlib.Path(infiles)
        if path.is_dir():
            print(f"Parsing the following {len(list(path.glob('**/*.json')))} files: ")
            for f in list(path.glob('**/*.json')):
                print("  - ", f.name)
            for p in tqdm(list(path.glob('**/*.json')), 'Files'):
                with open(p, 'r', encoding = "ISO-8859-1") as f:
                    logging.debug('\n\n***********************************************************')
                    logging.debug('adding file: {}'.format(p))
                    # irl = f.readlines()
                    try:
                        irl = json.load(f)
                        # Add bundle name to nodes 
                        for o in irl['objects']:
                            o['bundle_ref'] = p.name
                        insert_bundle(graph, irl['objects'])
                    except Exception as e:
                        logging.error(e)
                        logging.error(traceback.format_exc())
                        exit()
                time.sleep(1)

        else:
            with open(path, 'r', encoding = "ISO-8859-1") as f:
                logging.debug('\n\n***********************************************************')
                logging.debug('adding file: {}'.format(infiles))
                # irl = f.readlines()
                try:
                    irl = json.load(f)
                    insert_bundle(graph, irl['objects'])
                except Exception as e:
                    logging.error(e)
                    logging.error(traceback.format_exc())

        print('DONE!')
