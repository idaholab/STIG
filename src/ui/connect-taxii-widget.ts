/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { use_db, get_taxii } from "../db/dbFunctions";
import { DatabaseConfigurationStorage } from "../storage";
import { IDatabaseConfigOptions, TaxiiParams } from '../storage/database-configuration-storage';
import { BundleType, StixObject } from "../stix";
import { commit } from "../db/dbFunctions";
//var spawn = require('child_process').spawn;

export function openConnectTaxii(key?: string) {
    const dbdialog = new NewTaxiiConnection($('#connect-taxii-anchor'), key);
    dbdialog.open();
}

const body = `    <p id="label">URL:</p>
<p>
    <input type="text" id="url" value="http://localhost:5000/taxii2">
    <p id="label">API Root Name:</p>
    <input type="text" id="apiroot_name" value="">
    <p id="label">Collection ID:</p>
    <input type="text" id="collection_id" value="">
    <p id="label">Username:</p>
    <input type="text" id="username" value="">
    <p id="label">Password:</p>
    <input type="password" id="password" value="">
</p>
`;

class NewTaxiiConnection {
    public _storage: DatabaseConfigurationStorage;
    public _anchor: JQuery<HTMLElement>;
    public _list = "";
    public _header = "<div id='connect-taxii'>";
    public _footer = "</div>"; // "</ol>";
    private useConfig: string;

    constructor(anchor: JQuery, key?: string) {
        this._storage = DatabaseConfigurationStorage.Instance;
        this._anchor = anchor;
        this._footer = ""; // this._createDeleteButton();
        // this.populateHistoryDialog();
        key === undefined ? this.useConfig = this._storage.current : this.useConfig = key;
    }

    public addToDialog() {
        this._anchor.empty();
        this._anchor.html(this._header + body + this._footer);
        this.setupEventHandlers();
    }

    public setupEventHandlers() {
        return;
    }

    public isOpen(): boolean {
        return this._anchor.dialog( "isOpen" );
    }

    private loadData() {
        const params = this._storage.get(this.useConfig);
        $('#host').val(params.host);
        $('#port').val(params.port);
        $('#db_name').val(params.name);
        $('#username').val(params.username);
        $('#user_password').val(params.password);
    }

    private saveData() {
    
        const params: TaxiiParams = {
            url: $("#url").val() as string,
            apiroot_name: $("#apiroot_name").val() as string,
            collection_id: $("#collection_id").val() as string,
            username: $("#username").val() as string,
            password: $("#password").val() as string,
        };

        //console.log(params)
        get_taxii(params)

        const f = '../../temp_stix_taxii.json'
        const r = new FileReader();

        r.onload = (_e: Event) => {
            const bundle : BundleType = JSON.parse(r.result as string)  ////////////////////////// skip making a bundle, go straght to objects. Parse JSON objects
            const objects : StixObject[] = bundle.objects as StixObject[]
            const relationships : StixObject[] = []
            var numErrors = 0
            var i = 0
            $('.message-status').html(`Committing ${objects.length} to the database...`);
            for (const obj of objects) {
                $('.message-status').html(`Committing object ${i++}/${objects.length} ...`);
                // Save relationships for later
                if (obj.type == "relationship" || obj.type == "sighting") {
                    relationships.push(obj)
                } else {
                    // Commit everything else
                    console.log(obj)
                    let success = commit(obj)
                    if (!success) {
                        numErrors++
                    }
                }
            }
            for (const rel of relationships) {
                console.log(rel)
                $('.message-status').html(`Committing object ${i++}/${objects.length} ...`);
                let success = commit(rel)
                if (!success) {
                    numErrors++
                }
            }
        
            $('.message-status').html(`Successfully committed ${objects.length - numErrors} out of ${objects.length} objects.`);

            this.close()
        };
        r.readAsText(f);
      
    }

    private close() {
        if (this.isOpen()) {
            this._anchor.dialog("close");
        }
    }

    public open() {
        this.addToDialog();
        this._anchor.dialog({
            autoOpen: true,
            modal: true,
            width: 'maxcontent',
            maxWidth: window.innerWidth / 2,
            maxHeight: window.innerHeight - 100,
            buttons: [
                {
                    text: 'Cancel',
                    click: () => this.close(),
                },
                {
                    text: 'Upload TAXII to DB',
                    click: () => this.saveData(),
                },
            ],
        });
        this._anchor.dialog("open");
        //this.loadData();
    }
}
