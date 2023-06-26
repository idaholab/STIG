# import monkeytype
import pyorient
from pyorient.ogm import declarative
from pyorient.ogm.property import *

# with monkeytype.trace():
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
#     element_type = '`asset`'
#     element_plural = 'assets'
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
class KillChainPhase(Node):
    """For more detailed information on this object's properties, see
    `the STIX 2.1 specification <https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_i4tjv75ce50h>`__.
    """
    kill_chain_name = String(nullable=False)
    phase_name = String(nullable=True)


class MarkingDefinition(Node):
    # element_type = '`marking-definition`'
    # element_plural = 'markings'
    type = String(nullable=False)
    spec_version = String(nullable=False, default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    definition_type = String()
    definition = EmbeddedMap()


    class ExtensionDefinition(Node):
    # element_type = '`extension-definition`'
    # element_plural = 'extensions'
    type = String(nullable=False)
    spec_version = String(nullable=False, default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    schema = String()(nullable=False)
    version = String()(nullable=False)
    extension_types() = EmbeddedList()(nullable=False)
    extension_properties() = EmbeddedList()


class AttackPattern(Node):
    # element_type = '`attack-pattern`'
    # element_plural = 'attack_patterns'
    type = String(nullable=False)
    spec_version = String(nullable=False, default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    aliases = EmbeddedList()
    kill_chain_phases = EmbeddedList()


class Campaign(Node):
    # element_type = '`campaign`'
    # element_plural = 'campaigns'
    type = String(nullable=False)
    spec_version = String(nullable=False, default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
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
    # element_type = '`course-of-action`'
    # element_plural = 'actions'
    type = String(nullable=False)
    spec_version = String(nullable=False, default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    action = String()


class ExternalReference(Node):
    source_name = String()
    description = String()
    url = String()
    hashes = EmbeddedMap()
    external_id = String()


class GranularMarking(Node):
    lang = String()
    marking_ref = EmbeddedList()
    selectors = EmbeddedList()


class Grouping(Node):
    # element_type = '`grouping`'
    # element_plural = 'groupings'
    type = String(nullable=False)
    spec_version = String(nullable=False, default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    context = String()
    object_refs = EmbeddedList()


class Identity(Node):
    # element_type = '`identity`'
    # element_plural = 'identities'
    type = String(nullable=False)
    spec_version = String(nullable=False, default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    identity_class = String()
    sectors = EmbeddedList()
    contact_information = String()


class Indicator(Node):
    # element_type = '`indicator`'
    # element_plural = 'indicators'
    type = String(nullable=False)
    spec_version = String(nullable=False, default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    indicator_types = EmbeddedList()
    pattern = String(nullable=False)
    pattern_type = String()
    pattern_version = String()
    valid_from = DateTime()
    valid_until = DateTime()
    kill_chain_phases = EmbeddedList()


class Infrastructure(Node):
    # element_type = '`infrastructure`'
    # element_plural = 'infrastructures'
    type = String(nullable=False)
    spec_version = String(nullable=False, default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    infrastructure_types = EmbeddedList()
    aliases = EmbeddedList()
    kill_chain_phases = EmbeddedList(linked_to=KillChainPhase)
    first_seen = DateTime()
    last_seen = DateTime()


class IntrusionSet(Node):
    # element_type = '`intrusion-set`'
    # element_plural = 'intrusion_sets'
    type = String(nullable=False)
    spec_version = String(default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
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


class Location(Node):
    # element_type = '`location`'
    # element_plural = 'locations'
    type = String(nullable=False)
    spec_version = String(default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    latitude = Float()
    longitude = Float()
    precision = Float()
    region = String()
    country = String()
    administrative_area = String()
    city = String()
    street_address = String()
    postal_code = String()


class Malware(Node):
    # element_type = '`malware`'
    # element_plural = 'malwares'
    type = String(nullable=False)
    spec_version = String(default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String()
    description = String()
    malware_types = EmbeddedList()
    is_family = Boolean(default=False)
    aliases = EmbeddedList()
    kill_chain_phases = EmbeddedList()
    first_seen = DateTime()
    last_seen = DateTime()
    operating_system_refs = EmbeddedList()
    architecture_execution_envs = EmbeddedList()
    implementation_languages = EmbeddedList()
    capabilities = EmbeddedList()
    sample_refs = EmbeddedList()


class MalwareAnalysis(Node):
    # element_type = '`malware`'
    # element_plural = 'malwares'
    type = String(nullable=False)
    spec_version = String(default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    product = String()
    version = String()
    host_vm_ref = String()
    operating_system_ref = String()
    installed_software_ref = EmbeddedList()
    configuration_version = String()
    modules = EmbeddedList()
    analysis_engine_version = String()
    analysis_definition_version = String()
    submitted = DateTime()
    analysis_started = DateTime()
    analysis_ended = DateTime()
    result_name = String()
    result = String()
    analysis_sco_refs = EmbeddedList()
    sample_ref = String()


class Note(Node):
    # element_type = '`note`'
    # element_plural = 'notes'
    type = String(nullable=False)
    spec_version = String(default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    abstract = String()
    content = String()
    authors = EmbeddedList()
    object_refs = EmbeddedList()


class ObservedData(Node):
    # element_type = '`observed-data`'
    # element_plural = 'observed_data'
    type = String(nullable=False)
    spec_version = String(default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    first_observed = DateTime()
    last_observed = DateTime()
    number_observed = Integer(nullable=False, default=1)
    objects_ = EmbeddedMap()
    object_refs = EmbeddedList()


class Opinion(Node):
    # element_type = '`opinion`'
    # element_plural = 'opinions'
    type = String(nullable=False)
    spec_version = String(default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    explanation = String()
    authors = EmbeddedList()
    opinion = String()
    object_refs = EmbeddedList()


class Report(Node):
    # element_type = '`report`'
    # element_plural = 'reports'
    type = String(nullable=False)
    spec_version = String(default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    report_types = EmbeddedList()
    published = DateTime()
    object_refs = EmbeddedList()


class ThreatActor(Node):
    # element_type = '`threat-actor`'
    # element_plural = 'actors'
    type = String(nullable=False)
    spec_version = String(default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    threat_actor_types = EmbeddedList()
    aliases = EmbeddedList()
    first_seen = DateTime()
    last_seen = DateTime()
    roles = EmbeddedList()
    goals = EmbeddedList()
    sophistication = String()
    resource_level = String()
    primary_motivation = String()
    secondary_motivations = EmbeddedList()
    personal_motivations = EmbeddedList()


class Tool(Node):
    # element_type = '`tool`'
    # element_plural = 'tools'
    type = String(nullable=False)
    spec_version = String(default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList()
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList()
    name = String(nullable=False)
    description = String()
    tool_types = EmbeddedList()
    kill_chain_phases = EmbeddedList()
    tool_version = String()


class Vulnerability(Node):
    # element_type = '`vulnerability`'
    # element_plural = 'vulnerabilities'
    type = String(nullable=False)
    spec_version = String(default="2.1")
    id_ = String(nullable=False)
    created = DateTime(nullable=False)
    modified = DateTime(nullable=False)
    created_by_ref = String()
    revoked = Boolean(default=False, nullable=False)
    labels = EmbeddedList()
    confidence = Integer()
    lang = String()
    external_references = EmbeddedList(linked_to=ExternalReference)
    object_marking_refs = EmbeddedList()
    granular_markings = EmbeddedList(linked_to=GranularMarking)
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


class AnalysisOf(Relationships):
    label = 'analysis_of'
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


class AuthoredBy(Relationships):
    label = 'authored-by'
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


class BasedOn(Relationships):
    label = 'based_on'
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


class BeaconsTo(Relationships):
    label = 'beacons_to'
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


class Characterizes(Relationships):
    label = 'characterizes'
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


class Compromises(Relationships):
    label = 'compromises'
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


class CommunicatesWith(Relationships):
    label = 'communicates_with'
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


class ConsistsOf(Relationships):
    label = 'consists_of'
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


class Controls(Relationships):
    label = 'controls'
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


class Delivers(Relationships):
    label = 'delivers'
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


class Downloads(Relationships):
    label = 'downloads'
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


class Drops(Relationships):
    label = 'drops'
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


class DuplicateOf(Relationships):
    label = 'duplicate_of'
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


class DynamicAnalysisOf(Relationships):
    label = 'dynamic_analysis_of'
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


class DerivedFrom(Relationships):
    label = 'derived_from'
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


class ExfiltratesTo(Relationships):
    label = 'exfiltrates_to'
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


class Exploits(Relationships):
    label = 'exploits'
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


class Has(Relationships):
    label = 'has'
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


class Hosts(Relationships):
    label = 'hosts'
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


class Investigates(Relationships):
    label = 'investigates'
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


class Remediates(Relationships):
    label = 'remediates'
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


class LocatedAt(Relationships):
    label = 'located_at'
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


class OriginatesFrom(Relationships):
    label = 'originates_from'
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


class Owns(Relationships):
    label = 'owns'
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


class StaticAnalysisOf(Relationships):
    label = 'static_analysis_of'
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

    asset = {
        "id_": "asset--8210e4a9-7e8d-4a23-8978-2308a611aaaa",
        "type": "asset",
        "name": "Modicon Quantum PLC",
        "description": "A PLC made by Schneider Electric",
        "category": "Network",
        "kind_of_asset": "PLC",
        "category_ext": ["Operational Technology"],
        "compromised": False,
        "owner_aware": False,
        "technical_characteristics": [
            {
                "field": "ipv4-addr:value",
                "data": "192.168.140.100"
            },
            {
                "field": "mac-addr:value",
                "data": "00.00.54.20.27.89"
            },
            {
                "field": "network-traffic:protocols[*]",
                "data": "Modbus"
            },
            {
                "field": "Firmware Version",
                "data": "Version here"
            },
            {
                "field": "Manufacturer",
                "data": "schneider"
            },
            {
                "field": "Model",
                "data": "modicon"
            },
            {
                "field": "OS",
                "data": "VxWorks"
            },
            {
                "field": "OS Version",
                "data": "version number"
            }
        ],
        "created": "2017-03-13T14:02:10.000Z",
        "modified": "2017-03-13T14:02:10.000Z",
        "labels": ["infrastructure"]
    }
    # with monkeytype.trace():

    config = Config(host="127.0.0.1", user="root", db_name="test_embedded", storage="plocal", cred="OrientPW",
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
