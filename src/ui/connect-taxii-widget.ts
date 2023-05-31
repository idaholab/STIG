/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { use_db, get_taxii } from "../db/dbFunctions";
import { DatabaseConfigurationStorage } from "../storage";
import { IDatabaseConfigOptions, TaxiiParams } from '../storage/database-configuration-storage';
import { BundleType, StixObject } from "../stix";
import { commit } from "../db/dbFunctions";
//const fs = require('fs');
//import taxiiJson from '../../temp_stix_taxii.json';
//var spawn = require('child_process').spawn;

export function openConnectTaxii(key?: string) {
    const dbdialog = new NewTaxiiConnection($('#connect-taxii-anchor'), key);
    dbdialog.open();
}

const body = `    <p id="label">URL:</p>
<p>
    <input type="text" id="url" value="http://0.0.0.0:5000/taxii2">
    <p id="label">API Root Name:</p>
    <input type="text" id="apiroot_name" value="">
    <p id="label">Collection ID:</p>
    <input type="text" id="collection_id" value="">
    <p id="label">Username:</p>
    <input type="text" id="tax_username" value="">
    <p id="label">Password:</p>
    <input type="password" id="tax_password" value="">
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

    private async saveData() {

        // Create File

    
        // Get user Taxii input
        const tax: TaxiiParams = {
            url: $("#url").val() as string,
            apiroot_name: $("#apiroot_name").val() as string,
            collection_id: $("#collection_id").val() as string,
            username: $("#tax_username").val() as string,
            password: $("#tax_password").val() as string,
        };

        // var parts = [
        //     new Blob([])
        // ]
        // const f = new File([""], 'temp_stix_taxii.json')

        // console.log(params)

        
        
      
        

        // var objects = JSON.parse(fs.readFileSync('temp_stix_taxii.json', 'utf-8'))
        // console.log(objects)

     
        let objects = await get_taxii(tax) //await


        if (objects) {
            console.log("try here: ", objects)
        } else {
            console.log("tried")
        }



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
