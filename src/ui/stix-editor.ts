/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import cytoscape from 'cytoscape';
import moment from 'moment';
import { StixNodeData } from '../stix';
import { schema_map } from '../stix/stix_schemas';

type JSONEditorOptionsExtended = JSONEditorOptions & { remove_empty_properties: boolean };
class JSONEditorExtended extends JSONEditor {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (element: HTMLElement, options: JSONEditorOptionsExtended) {
    super(element, options);
  }
}

export class StixEditor {
  public editor: JSONEditor;
  public form_changed: () => void;
  public cy: cytoscape.Core;

  constructor (cy: cytoscape.Core) {
    this.cy = cy;
  }

  /**
   * @param {cytoscape.Singular} node The Node object from the graph
   * @param {string} file_name The name of the json_schema -- use the name of the type field in the schema
   * @param {any} to_inspect JSON Data to populate the form widget
   */
  public buildWidget (node: cytoscape.Singular, file_name: string, to_inspect: unknown): void {
    $('#metawidget').empty();
    $('#current_node').get().forEach((i) => {
      i.setAttribute('node_id', node.id());
    });

    // Find the schema in schema_map
    const schema = Object.keys(schema_map).find(s => s.includes(file_name + '.json'));

    const raw_data: StixNodeData = node.data('raw_data') as StixNodeData;

    if (raw_data.id === undefined || /--$/.exec(raw_data.id) !== null) {
      raw_data.id = node.data('type') + '--' + node.id();
    }
    if (raw_data.created === undefined || !moment(raw_data.created).isValid()) {
      raw_data.created = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    }
    if (raw_data.type !== 'marking-definition') {
      if (raw_data.modified === undefined || !moment(raw_data.modified).isValid()) {
        raw_data.modified = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      }
    }
    this.editor = new JSONEditorExtended(document.getElementById('metawidget')!, {
      ajax: true,
      startval: to_inspect,
      required_by_default: false,
      theme: 'bootstrap4',
      iconlib: 'fontawesome4',
      refs: schema_map,
      schema: schema_map[schema!],
      remove_empty_properties: true

    });
    if (node.data('saved') === true) {
      $('button.btn-commit').prop('disabled', true);
    } else {
      $('button.btn-commit').prop('disabled', false);
    }

    /** *************************************** *
        *        Export Single JSON
        *************************************** */

    this.editor.on('ready', () => {
      this.form_changed = () => {
        // @ts-expect-error: Property 'root' does not exist on type 'JSONEditor<any>'.
        const new_data = this.editor.root.getValue();
        const ele = this.cy.getElementById($('#current_node').attr('node_id')!) as cytoscape.SingularElementReturnValue;
        if (ele === undefined) { return; }
        if (ele.isNode() && new_data.name != null) {
          ele.data('content', new_data.name);
          ele.data('name', new_data.name);
        } else if (ele.isEdge()) {
          ele.data('content', new_data.relationship_type);
          ele.style('label', new_data.relationship_type);
        }
        ele.data('raw_data', new_data);
        ele.data('saved', false);
        $('button.btn-commit').button('enable');
      };

      this.editor.on('change', this.form_changed);
    });
  }
}
