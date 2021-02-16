from typing import Dict

from pyorient.ogm import Graph, declarative
from pyorient.ogm.property import *

prop_map = {
    "type": String(nullable=False),
    "created_by_ref": String(),
    "name": String(),
    "created": DateTime(nullable=False),
    "modified": DateTime(nullable=False),
    "revoked": Boolean(default=False, nullable=False),
    "labels": EmbeddedList(),
    "external_references": EmbeddedList(),
    "object_marking_refs": EmbeddedList(),
    "granular_markings": EmbeddedList(),
    "description": String(),
    "relationship_type": String(nullable=False),
    "source_ref": String(nullable=False),
    "target_ref": String(nullable=False)
}


def class_from_json(stx: Dict, graph: Graph):
    id_ = stx.pop('id_')
    if stx['type'] == 'relationship':
        graph_class = declarative.declarative_relationship()
        class_name = stx['relationship_type'].replace('-', '_')
        props = {
            'id_': String(nullable=False),
            'label': class_name,
        }
    else:
        graph_class = declarative.declarative_node()
        class_name = stx['type'].replace('-', '')
        props = {
            'id_': String(nullable=False),
            'element_type': class_name,
            'element_plural': class_name + 's'
        }
    for k, v in stx.items():
        if k in prop_map:
            props[k] = prop_map[k]
        elif isinstance(v, list):
            props[k] = EmbeddedList()
        elif isinstance(v, str):
            props[k] = String()
        elif isinstance(v, int):
            props[k] = Integer()
        elif isinstance(v, float):
            props[k] = Float()
        else:
            print(f'Need a property mapping for {k}: {props[k]}')

    new_cls = type(class_name, (graph_class,), props)
    graph.create_class(new_cls)
    return new_cls
