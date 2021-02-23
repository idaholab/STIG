# noinspection PyProtectedMember
import json
import pathlib

from stix2.exceptions import TLPMarkingDefinitionError
from stix2.v20 import _DomainObject
import stix2.workbench as workbench

from tqdm import tqdm


def obj_to_21(twozero: _DomainObject):
    try:
        new_obj = workbench.parse(twozero, allow_custom=True)
        if workbench.get(new_obj['id']) is None:
            return new_obj
    except TLPMarkingDefinitionError as e:
        if hasattr(e, 'spec_obj'):
            return workbench.MarkingDefinition(**e.spec_obj)
        else:
            print('Bad marking definition:', 0)
            print(e, '\n')
    except ValueError as e:
        print('ValueError parsing: ', twozero)
        print(e)
        print('\n')
    except Exception as e:
        print('Some other exception parsing:', o)
        print(e, '\n')


if __name__ == '__main__':
    from stix2 import FileSystemSink
    store_path = pathlib.Path('/Users/priezm/repos/GTO/stix_worknench/')
    path = pathlib.Path('/Users/priezm/repos/GTO/working_stix_corpora')
    if not store_path.exists():
        store_path.mkdir(parents=True)
    fs = workbench.FileSystemSource(str(store_path))
    workbench.add_data_source(fs)

    sink = FileSystemSink('/Users/priezm/repos/GTO/stix_worknench/', allow_custom=True)
    if path.is_dir():
        for p in tqdm(list(path.glob('**/*.json')), 'Files'):
            with open(p, 'r') as f:
                print('\n\n***********************************************************')
                print('adding file: {}'.format(p))
                try:
                    irl = json.load(f)
                    print('our irl: ', irl)
                    print('our objects: ', irl['objects'])
                    for o in tqdm(irl['objects'], 'Objects'):
                        new_obj = obj_to_21(o)
                        print('adding to sink')
                        if new_obj is not None:
                            sink.add(new_obj)
                except Exception as e:
                    print(e)
    else:
        with open(path, 'r') as f:
            print('\n\n***********************************************************')
            print('adding file: {}'.format(path))
            try:
                irl = json.load(f)
                for o in tqdm(irl['objects'], 'Objects'):
                    obj_to_21(o)
            except Exception as e:
                print(e)
