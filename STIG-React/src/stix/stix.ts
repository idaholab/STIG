import { stencilItems } from "@/components/elements/StencilItems";
import { DataSourceType } from "@/types/DataSourceType";
import { CytoscapeNode } from "@/types/cytoscapeTypes/CytoscapeNode";
import { CytoscapeNodeData } from "@/types/cytoscapeTypes/CytoscapeNodeData";
import { v4 as uuidv4 } from 'uuid';
import { StixRelationshipObject } from "@/types/stixTypes/StixRelationshipObject";
import { convertISOToStandardDateFormat } from "@/util/convertISO8601ToStandardDate";
import moment from "moment";
import { SingularElementArgument } from "cytoscape";
import { SchemaSTIXClass } from "@/types/stixSchemaTypes/SchemaSTIXClass";
import { schema } from "./schema";
import { StixObject } from "@/types/stixTypes/StixObject";
import { SchemaSTIXProperty } from "@/types/stixSchemaTypes/SchemaSTIXProperty";
import { enum_options } from "./enumOptions";
import { open_vocab_options } from "./openVocabOptions";
function stixTypeCheck(prop: SchemaSTIXProperty, v: unknown): boolean {
  if (prop.mandatory && v === undefined) return false;
  if (!prop.notNull && v === null) return true;
  switch (prop.type) {
    case 'string':
    case 'enum':
    case 'timestamp': // TODO: make this more precise
    case 'identifier': // TODO: make this more precise
    case 'binary': return typeof v == 'string' || v instanceof String;
    case 'boolean': return typeof v == 'boolean' || v instanceof Boolean;
    case 'list': return v instanceof Array && v.every(e => stixTypeCheck({ type: prop.listType } as any, e));
    case 'float': return typeof v == 'number' || v instanceof Number && (prop.min === undefined || +v >= prop.min) && (prop.max === undefined || +v <= prop.max);
    case 'integer': return Math.floor(v as number) === v && (prop.min === undefined || v >= prop.min) && (prop.max === undefined || v <= prop.max);
    case 'dictionary': return typeof v == 'object' && !(v instanceof Array);
    case 'hashes':
    case 'open-vocab':
    default: return true;
  }
}

function stixTypeDefaults(prop: SchemaSTIXProperty): unknown {
  if (!prop.notNull) return null;
  switch (prop.type) {
    case 'string': return prop.default!== undefined ? prop.default : undefined ; 
    case 'enum': return prop.enumType !== undefined ? enum_options[prop.enumType][0] : ""
    case 'timestamp': // TODO: make this more precise
    case 'identifier': // TODO: make this more precise
    case 'binary': return undefined;
    case 'boolean': return prop.default !== undefined ? prop.default : false;
    case 'list': return prop.default !== undefined ? prop.default : undefined;
    case 'float':
    case 'integer': return prop.min ?? 0;
    case 'open-vocab': return prop.openVocabType !== undefined ? open_vocab_options[prop.openVocabType][0] : ""
    case 'dictionary': 
    case 'hashes':
    default: return undefined;
  }
}

export const createObjectMarkingRelationship = (
  source_ref: string,
  target_ref: string,
  created: string,
  modified: string
): StixRelationshipObject => {
  return {
    type: 'relationship',
    spec_version: '2.1',
    relationship_type: 'applies-to',
    id: `applies-to--${uuidv4()}`,
    source_ref,
    target_ref,
    created,
    modified,
    description: '',
  };
};

export const getNodeLabel = (node: CytoscapeNodeData): string | undefined => {
    let nodelabel: string = '';
    const labelorder = ['name', 'value', 'key', 'path', 'product', 'dst_port', 'command_line', 'labels', 'type', 'id'];
    for (const element of labelorder) {
        if (Object.prototype.hasOwnProperty.call(node, element)) {
            if (element === 'dst_port') {
                const { [element]: nodelabel1, src_port, protocols } = node;
                if(nodelabel1 && src_port && protocols) {
                    nodelabel = src_port.toString().concat(' -> ', nodelabel1.toString(), '/', protocols.toString());
                }
            } else if (element === 'labels') {
                const nodeLabelslabel = (node?.labels && node?.labels?.length > 0) ? node.labels.join(', ') : '';
                nodelabel = `${nodeLabelslabel ? nodeLabelslabel : node[element]}`;
            } else {
                nodelabel = node[element];
            }
            break;
        }
    }

    nodelabel = (nodelabel && nodelabel?.length > 60) ? nodelabel.substring(0, 60).concat('...') : nodelabel;
    if (node.type === 'observed-data') {
        // If this gets duplicated then the label is getting saved with the stix when it shouldn't!
        nodelabel = `${nodelabel} (${convertISOToStandardDateFormat(moment(node.last_observed).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'))})`;
    }

    return nodelabel;
};

export const createCytoscapeNode = (
    node: CytoscapeNodeData,
    dataSourceType: DataSourceType,
    isNewNode: boolean,
    imgUrl?: string,
): CytoscapeNode => {
    let newCytoscapeNode: CytoscapeNodeData = addStixPropertiesToNode(node, isNewNode);
    let nodelabel = getNodeLabel(newCytoscapeNode);
    newCytoscapeNode.label = nodelabel; // All cytoscape nodes need a label. Just not the stix.

    const nodeImage = (imgUrl) ? imgUrl : stencilItems.find(stencilItem => stencilItem.id === node.type)?.imageUrl;
    const style: CSSStyleDeclaration = { backgroundImage: nodeImage } as unknown as CSSStyleDeclaration;
    const classes = 'stix_node';
    return {
        data: newCytoscapeNode,
        style: style,
        data_source: dataSourceType,
        saved: dataSourceType === 'DB' || dataSourceType === 'IGNORE',
        classes: classes
    };
};

function addStixPropertiesToNode(node: CytoscapeNodeData, isNewNode: boolean): CytoscapeNodeData {
    let returnedNode: CytoscapeNodeData = { ...node };
    if (isNewNode) {
        if (returnedNode.type === 'indicator') {
            returnedNode.valid_from = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        } else if (returnedNode.type === 'observed-data') {
            returnedNode.first_observed = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            returnedNode.last_observed = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        } else if (returnedNode.type === 'report') {
            returnedNode.published = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        }
    }
    const raw_data = { ...returnedNode };
    delete raw_data.label; // Label does not belong in stix data. User can add their own custom labels list
    returnedNode.raw_data = raw_data;
    return returnedNode;
};

function getAllProps(schemaObject: SchemaSTIXClass) {
  const props = [...schemaObject.properties];
  const stack = [...schemaObject.superClasses];
  while (stack.length) {
      const superClass = stack.pop();
      const superClassObject = schema.find(c =>
      c.name.replace(/-/g, '') === superClass
      );
      if (superClassObject) {
      props.push(...superClassObject.properties);
      stack.push(...superClassObject.superClasses);
      }
    }
    return props;
  }

export function checkProps(object: StixObject): boolean {
  const schemaObject = schema.find(c => { return c.name === object.type; });
  if (typeof schemaObject !== 'object') {
      return false;
  }

  // Get the required props from the schema
  const props = getAllProps(schemaObject);
  const reqProps = props.filter(prop => prop.mandatory);
  const allowedProps = new Map(props.filter(prop => !prop.mandatory).map(prop => [prop.name, prop]));
  for (const prop of reqProps) {
      // id_ only exists on the database side. Skip this.
      if (prop.name === 'id_') continue;
      if (!stixTypeCheck(prop, (object as any)[prop.name])) return false;
  }

  for (const key of Object.keys(object)) {
      const prop = allowedProps.get(key);
      if (prop && !stixTypeCheck(prop, object[key])) return false;
  }

  return true;
}

export function setProps(object: StixObject) {
  const schemaObject = schema.find(c => { return c.name === object.type; });
  if (typeof schemaObject !== 'object') {
      return object;
  }

  object.spec_version = '2.1';

  // Get the required props from the schema
  const props = getAllProps(schemaObject);
  const reqProps = props.filter(prop => prop.mandatory);
  const allowedProps = new Map(props.filter(prop => !prop.mandatory).map(prop => [prop.name, prop]));
  for (const prop of reqProps) {
    // id_ only exists on the database side. Skip this.
    if (prop.name === 'id_') continue;
    if (!stixTypeCheck(prop, (object as any)[prop.name])) {
      (object as any)[prop.name] = stixTypeDefaults(prop);
    }
  }

  for (const key of Object.keys(object)) {
    const prop = allowedProps.get(key);
    if (prop && !stixTypeCheck(prop, object[key])) delete object[key];
  }

  return object;
}

export function cycore2stix(o: SingularElementArgument): StixObject | undefined {
const n = o.data('raw_data');
return n === undefined
    ? n
    : setProps({
    // The spec_version is mandatory, but sometimes it doesn't exist on the objects.
    // This adds it if it isn't there already.
    // TODO: It might be better to just add the spec_version when an object is created.
    spec_version: '2.1',
    ...n
    });
};