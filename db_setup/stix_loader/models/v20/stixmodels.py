import pyorient
from pyorient.ogm import declarative
from pyorient.ogm.property import *

Node = declarative.declarative_node()
Relationships = declarative.declarative_relationship()


class Core(Node):
    # element_type = 'asset'
    # element_plural = 'assets'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()


class Asset(Node):
    element_type = '`asset`'
    element_plural = 'assets'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    category = String()
    kind_of_asset = String()
    category_ext = EmbeddedList()
    compromised = Boolean(default=False)
    owner_aware = Boolean(default=False)
    technical_characteristics = EmbeddedList()


class AttackPattern(Node):
    element_type = '`attack-pattern`'
    element_plural = 'attack_patterns'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    kill_chain_phases = EmbeddedList()


class Campaign(Node):
    element_type = '`campaign`'
    element_plural = 'campaigns'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    aliases = EmbeddedList()
    first_seen = DateTime()
    last_seen = DateTime()
    objective = String()


class CourseOfAction(Node):
    element_type = '`course-of-action`'
    element_plural = 'actions'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()


class Identity(Node):
    element_type = '`identity`'
    element_plural = 'identities'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    identity_class = String(nullable=False)
    sectors = String()
    contact_information = String()


class Indicator(Node):
    element_type = '`indicator`'
    element_plural = 'indicators'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    pattern = String(nullable=False)
    valid_from = DateTime()
    valid_until = DateTime()
    kill_chain_phases = EmbeddedList()


class IntrusionSet(Node):
    element_type = '`intrusion-set`'
    element_plural = 'intrusion_sets'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    aliases = EmbeddedList()
    first_seen = DateTime()
    last_seen = DateTime()
    goals = EmbeddedList()
    resource_level = String()
    primary_motivation = String()
    secondary_motivations = EmbeddedList()


class Malware(Node):
    element_type = '`malware`'
    element_plural = 'malwares'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    labels = EmbeddedList(nullable=False)
    name = String(nullable=False)
    description = String()
    kill_chain_phases = EmbeddedList()

class MarkingDefinition(Node):
    element_type = '`marking-definition`'
    element_plural = 'markings'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=True)
    revoked = Boolean(default=False, nullable=False)
    definition_type = String()
    definition = EmbeddedMap()

class ObservedData(Node):
    element_type = '`observed-data`'
    element_plural = 'observed_data'
    type = String(nullable=False)
    id_ = String(nullable=False)
    name = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    first_observed = DateTime()
    last_observed = DateTime()
    number_observed = Integer(nullable=False)
    objects_ = EmbeddedMap()


class Report(Node):
    element_type = '`report`'
    element_plural = 'reports'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    labels = EmbeddedList(nullable=False)
    name = String(nullable=False)
    description = String()
    published = DateTime()
    object_refs = EmbeddedList()


class ThreatActor(Node):
    element_type = '`threat-actor`'
    element_plural = 'actors'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    labels = EmbeddedList(nullable=False)
    name = String(nullable=False)
    description = String()
    aliases = EmbeddedList()
    roles = EmbeddedList()
    goals = EmbeddedList()
    sophistication = String()
    resource_level = String()
    primary_motivation = String()
    secondary_motivations = EmbeddedList()
    personal_motivations = EmbeddedList()


class Tool(Node):
    element_type = '`tool`'
    element_plural = 'tools'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    labels = EmbeddedList(nullable=False)
    name = String(nullable=False)
    description = String()
    kill_chain_phases = EmbeddedList()
    tool_version = String()


class Vulnerability(Node):
    element_type = '`vulnerability`'
    element_plural = 'vulnerabilities'
    type = String(nullable=False)
    id_ = String(nullable=False)
    created_by_ref = String()
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()


class Relationship(Relationships):
    label = 'relationship'
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    external_references = EmbeddedList()
    revoked = Boolean()
    created_by_ref = String()
    id_ = String(nullable=False)
    type = String(nullable=False)
    relationship_type = String(nullable=False)
    source_ref = String(nullable=False)
    target_ref = String(nullable=False)


class RelatedTo(Relationships):
    label = 'related_to'
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    external_references = EmbeddedList()
    revoked = Boolean()
    created_by_ref = String()
    id_ = String(nullable=False)
    type = String(nullable=False)
    relationship_type = String(nullable=False)
    source_ref = String(nullable=False)
    target_ref = String(nullable=False)


class Indicates(Relationships):
    label = 'indicates'
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    external_references = EmbeddedList()
    revoked = Boolean()
    created_by_ref = String()
    id_ = String(nullable=False)
    type = String(nullable=False)
    relationship_type = String(nullable=False)
    source_ref = String(nullable=False)
    target_ref = String(nullable=False)


class Targets(Relationships):
    label = 'targets'
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    external_references = EmbeddedList()
    revoked = Boolean()
    created_by_ref = String()
    id_ = String(nullable=False)
    type = String(nullable=False)
    relationship_type = String(nullable=False)
    source_ref = String(nullable=False)
    target_ref = String(nullable=False)


class Uses(Relationships):
    label = 'uses'
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    external_references = EmbeddedList()
    revoked = Boolean()
    created_by_ref = String()
    id_ = String(nullable=False)
    type = String(nullable=False)
    relationship_type = String(nullable=False)
    source_ref = String(nullable=False)
    target_ref = String(nullable=False)


class Mitigates(Relationships):
    label = 'mitigates'
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    external_references = EmbeddedList()
    revoked = Boolean()
    created_by_ref = String()
    id_ = String(nullable=False)
    type = String(nullable=False)
    relationship_type = String(nullable=False)
    source_ref = String(nullable=False)
    target_ref = String(nullable=False)


class VariantOf(Relationships):
    label = 'variant_of'
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    external_references = EmbeddedList()
    revoked = Boolean()
    created_by_ref = String()
    id_ = String(nullable=False)
    type = String(nullable=False)
    relationship_type = String(nullable=False)
    source_ref = String(nullable=False)
    target_ref = String(nullable=False)


class AttributedTo(Relationships):
    label = 'attributed_to'
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    external_references = EmbeddedList()
    revoked = Boolean()
    created_by_ref = String()
    id_ = String(nullable=False)
    type = String(nullable=False)
    relationship_type = String(nullable=False)
    source_ref = String(nullable=False)
    target_ref = String(nullable=False)


class Impersonates(Relationships):
    label = 'impersonates'
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    external_references = EmbeddedList()
    revoked = Boolean()
    created_by_ref = String()
    id_ = String(nullable=False)
    type = String(nullable=False)
    relationship_type = String(nullable=False)
    source_ref = String(nullable=False)
    target_ref = String(nullable=False)


if __name__ == '__main__':
    from pyorient.ogm import Graph, Config

    

    config = Config(host="127.0.0.1", user="root", db_name="gto", storage="plocal", cred="root",
                    port=2424, initial_drop=True)

    # graph = Graph(Config.from_url('localhost/g-test', 'root', 'root', initial_drop=True))
    # graph = Graph(Config.from_url('localhost/g-test', 'root', 'root'))
    graph = Graph(config)
    graph.create_all(Node.registry)
    print("create_all done for nodes")
    # print(result)
    graph.create_all(Relationships.registry)
    print("create_all done for Relationships")
    # print(result)
    # try:
    #     result = graph.assets.create(**asset)
    #     print("created an asset")
    #     print(result)
    #     print("Querying...")
    #     result = graph.assets.query(name=asset["name"]).one()
    #     print(dir(result))
    # except Exception as e:
    #     print('Exception:')
    #     print(e)
    print('DONE!')
