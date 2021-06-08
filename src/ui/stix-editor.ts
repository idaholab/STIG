/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import cytoscape from 'cytoscape';
import * as moment from 'moment';
import { StigDB } from "../db";
import { StixNodeData } from '../stix';
import { schema_map } from '../stix/stix_schemas';

type JSONEditorOptionsExtended<TValue> = JSONEditorOptions<TValue> & { remove_empty_properties: boolean };
class JSONEditorExtended<TValue> extends JSONEditor<TValue> {
    constructor(element: HTMLElement, options: JSONEditorOptionsExtended<TValue>) {
        super(element, options);
    }
}

export class StixEditor {
    public editor: JSONEditorExtended<any>;
    public db: StigDB;
    public form_changed: () => void;
    public cy: cytoscape.Core;

    constructor(cy: cytoscape.Core, db: StigDB) {
        try {
            this.db = db;
        } catch (e) {
            const err = new Error();
            err.message += e.message;
            err.name = "StixEditorDatabaseFailure: ";
            err.stack += e.stack;
            throw err;
        }
        this.cy = cy;
    }

    /**
     *
     *
     * @param {cytoscape.Singular} node The Node object from the graph
     * @param {string} file_name The name of the json_schema -- use the name of the type field in the schema
     * @param {any} to_inspect JSON Data to populate the form widget
     */
    public buildWidget(node: cytoscape.Singular, file_name: string, to_inspect: any): void {
        $('#metawidget').empty();
        $('#current_node').get().forEach((i) => {
            i.setAttribute('node_id', node.id());
        });
        const raw_data: StixNodeData = node.data('raw_data') as StixNodeData;
        if (raw_data.id === undefined || /--$/.exec(raw_data.id)) {
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
            theme: "bootstrap4",
            iconlib: "fontawesome4",
            refs: schema_map,
            schema: schema_map[`${file_name}.json`],
            remove_empty_properties: true,
        });
        if (node.data('saved') === true) {
            $('button.btn-commit').prop('disabled', true);
        } else {
            $('button.btn-commit').prop('disabled', false);
        }

        /***************************************** *
        *        Export Single JSON
        *************************************** */
        // $(document).off('click', '#btn-export-single').on('click', '#btn-export-single', function (e) {

        this.editor.on("ready", () => {
            this.form_changed = () => {
                // @ts-ignore: Property 'root' does not exist on type 'JSONEditor<any>'.
                const new_data = this.editor.root.getValue();
                const ele = this.cy.getElementById($('#current_node').attr('node_id')) as cytoscape.SingularElementReturnValue;
                if (ele === undefined) { return; }
                if (ele.isNode() && new_data.name != null) {
                    ele.data("content", new_data.name);
                    ele.data("name", new_data.name);
                } else if (ele.isEdge()) {
                    ele.data("content", new_data.relationship_type);
                    ele.style('label', new_data.relationship_type);
                }
                ele.data("raw_data", new_data);
                // ele.data('saved', false);
                this.db.needs_save(ele.id(), window.cycore).then((save) => {
                    save ? $('button.btn-commit').button('enable') : $('button.btn-commit').button('disable');
                });
            };

            this.editor.on('change', this.form_changed);
            // this.editor.watch('root', this.form_changed);
        });
    }
}
