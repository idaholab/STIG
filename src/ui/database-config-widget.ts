/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { DatabaseConfigurationStorage } from "../storage";
import { ipcRenderer } from 'electron';
import { newDatabaseConfiguration } from './new-database-widget';

export function openDatabaseConfiguration() {
    const dbdialog = new DatabaseConfigDialog($('#db-dialog-anchor'));
    dbdialog.open();
}

class DatabaseConfigDialog {
    public _storage: DatabaseConfigurationStorage;
    public _anchor: JQuery<HTMLElement>;
    public _list = "";
    public _header = "<div id='db-config-list'>";
    public _footer = "</div>";
    private useConfig: string;

    constructor(anchor: JQuery) {
        this._storage = DatabaseConfigurationStorage.Instance;
        this._anchor = anchor;
        this._footer = '';
        this.useConfig = this._storage.current;
        $('#new-db-anchor').on("dialogclose", ( ) => {
            this.close();
            this.open();
        } );
    }

    public open() {
        this.addToDialog();
        this._anchor.dialog({
            autoOpen: true,
            width: 'maxcontent',
            modal: true,
            maxWidth: window.innerWidth / 2,
            maxHeight: window.innerHeight - 100,
            buttons: [
                {
                    text: 'Cancel',
                    id: 'close-btn',
                    click: () => this.close(),
                },
                {
                    text: 'Use',
                    id: 'use-btn',
                    click: () => this.useDatabase(),
                },
                {
                    text: 'Delete',
                    id: 'delete-btn',
                    click: () => this.deleteSelected(),
                },
                {
                    text: 'Edit',
                    id: 'edit-btn',
                    click: () =>  this.editDatabase(),
                },
                {
                    text: 'New',
                    id: 'new-btn',
                    click: () => this.newDatabase(),
                },
            ],
        });

        $(".controlgroup").controlgroup({
            direction: "vertical",
        });
        $( `#db-config-list input[type='radio']`).prop('checked', false);
        $( `#db-config-list input[type='radio'][value='${this._storage.current}']` ).prop('checked', true);
        $( "#db-config-list input[type='radio']" ).checkboxradio('refresh');
    }

    public addToDialog() {
        const keys = this._storage.keys();
        this._list = "";
        let i = 0;
        this._list += `<div class="controlgroup">`;
        for (const k of keys) {
            this._list += `<label for="x-db-config-${i}">${k}</label>`;
            this._list += `<input type="radio" id="x-db-config-${i}" name="db_selection" value="${k}">`;
            i++;
        }
        this._list += `</div>`;
        this._anchor.empty();
        this._anchor.html(this._header + this._list + this._footer);
        this.setupEventHandlers();
    }

    public setupEventHandlers() {
        //     this.useConfig = $('#db-config-list .ui-selected')[0].innerText;
    }

    private deleteSelected() {
        this._storage.removeConfig($( "#db-config-list input:checked" ).val() as string);
        this.close();
        this.open();
    }

    private newDatabase() {
        newDatabaseConfiguration();
    }

    private editDatabase() {
        newDatabaseConfiguration($( "#db-config-list input:checked" ).val() as string);
    }

    private useDatabase() {
        this.useConfig = $( "#db-config-list input:checked" ).val() as string;
        this._storage.current = this.useConfig;
        ipcRenderer.send('useDatabase', this._storage.get(this.useConfig));
        //add progress bar here tied to
        this._anchor.dialog("close");
    }

    public isOpen(): boolean {
        return this._anchor.dialog( "isOpen" );
    }

    private close() {
        if (this.isOpen()) {
            this._anchor.dialog("close");
        }
    }
}
