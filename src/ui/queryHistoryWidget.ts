/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import { QueryStorageService } from '../storage';
import { IDialogEventData } from './diff-dialog';

export class QueryHistoryDialog {
    private _hidden_list: JQuery<HTMLElement>;
    public _storage: QueryStorageService;
    public _anchor: JQuery<HTMLElement>;
    public _list = "";
    public _header = "<div id='query-list'>";
    public _footer = "</div>";

    constructor(anchor: JQuery) {
        this._storage = QueryStorageService.Instance;
        this._hidden_list = $('#history-list');
        this._anchor = anchor;
        this._footer = "";
    }

    public open() {
        this.addToHistoryDialog();
        this._anchor.dialog({
            autoOpen: true,
            width: 'maxcontent',
            maxWidth: window.innerWidth / 2,
            maxHeight: window.innerHeight - 100,
            buttons: {
                Close() {
                    $(this).dialog("close");
                },
                Query() {
                    $("#btn-db-search").trigger("click");
                },
            },
        });
    }

    public addToHistoryDialog() {
        const items = this._storage.getQueries();
        this._list = "";
        let i = 0;
        for (const k of items) {
            this._list += `<div class="query-row" x-history-key="${i}"> ${i}. </div>`;
            this._list += `<div id="query-id-${i}" class="query-item"> ${k} </div>`;
            this._list +=  `<div class="btn-history"><button title="Remove Selected" id="btn-history-delete-${i}" class="ui-button-icon-only btn-history-delete" x-history-key="${i}" ></button></div>`;
            i++;
        }
        this._anchor.empty();
        this._anchor.html(this._header + this._list + this._footer);
        for (let j = 0; j < this._storage.getQueries().length; j++) {
            const btn_item = $(`#btn-history-delete-${j}`);
            btn_item.button();
            btn_item.button("option", "icon", "ui-icon-close");
        }
        this.setupEventHandlers();
    }

    public setupEventHandlers() {
        $('#query-list').selectable();
        $('.btn-history-delete').on("click", null, { self: this } as IDialogEventData, this._deleteSelected);
        $('#query-list').on("selectablestop", (_event: JQueryEventObject) => {
            const ta: HTMLTextAreaElement = $('#dbSearch')[0] as HTMLTextAreaElement;
            ta.value = $('#query-list div.ui-selectee.ui-selected')[0].innerText;
        });
    }

    // private _createDeleteButton(key: number): string {
    //     return  `<button title="Remove Selected" id="btn-history-delete-${key}" class="ui-button-icon-only btn-history-delete" x-history-key="${key}" ></button>`;
    //     // ret += ' style= "float: right" x-history-key="' + key + '" >';
    //     // let ret = '<button type="button" title="Remove Selected" class="ui-button ui-widget ui-corner-all ui-button-icon-only btn-history-delete" id="btn-history-delete"';
    //     // ret += '<span class="ui-icon ui-icon-close"></span></button>';
    // }

    private _deleteSelected(e: JQueryEventObject) {
        e.preventDefault();
        e.stopPropagation();
        const self: QueryHistoryDialog = e.data.self;
        const hist_idx = e.target.parentElement.getAttribute('x-history-key');
        self._storage.removeQueryByIndex(Number(hist_idx));
        self.addToHistoryDialog();
    }
}
