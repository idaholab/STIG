/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import { QueryStorageService } from '../storage';
import { IDialogEventData } from './diff-dialog';

export class QueryHistoryDialog {
  public _storage: QueryStorageService;
  public _anchor: JQuery<HTMLElement>;
  public _list = '';
  public _header = "<div id='query-list'>";
  public _footer = '</div>';

  constructor (anchor: JQuery) {
    this._storage = QueryStorageService.Instance;
    this._anchor = anchor;
    this._footer = '';
  }

  public open (): void {
    this.addToHistoryDialog();
    this._anchor.dialog({
      autoOpen: true,
      width: 'maxcontent',
      maxWidth: window.innerWidth / 2,
      maxHeight: window.innerHeight - 100,
      buttons: {
        Close () {
          $(this).dialog('close');
        },
        Query () {
          $('#btn-db-search').trigger('click');
        }
      }
    });
  }

  public addToHistoryDialog (): void {
    const items = this._storage.getQueries();
    this._list = '';
    const imax = items.length - 1;
    for (let i = imax; i >= 0; i--) {
      this._list += `<div class="query-row" x-history-key="${i}"> ${imax - i + 1}. </div>`;
      this._list += `<div id="query-id-${i}" class="query-item"> ${items[i]} </div>`;
      this._list += `<div class="btn-history">
        <button
          title="Remove Selected"
          id="btn-history-delete-${i}"
          class="ui-button-icon-only
          btn-history-delete"
          x-history-key="${i}"
        ></button>
      </div>`;
    }
    this._anchor.empty();
    this._anchor.html(this._header + this._list + this._footer);
    for (let j = 0; j <= imax; j++) {
      const btn_item = $(`#btn-history-delete-${j}`);
      btn_item.button();
      btn_item.button('option', 'icon', 'ui-icon-close');
    }
    this.setupEventHandlers();
  }

  public setupEventHandlers (): void {
    $('#query-list').selectable();
    $('.btn-history-delete').on('click', null, { self: this } as IDialogEventData, this._deleteSelected);
    $('#query-list').on('selectablestop', (_event) => {
      const ta: HTMLTextAreaElement = $('#dbSearch')[0] as HTMLTextAreaElement;
      ta.value = $('#query-list div.ui-selectee.ui-selected')[0].innerText;
    });
  }

  private _deleteSelected (e: JQuery.TriggeredEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const self = e.data.self as QueryHistoryDialog;
    const hist_idx = e.target.parentElement.getAttribute('x-history-key');
    self._storage.removeQueryByIndex(Number(hist_idx));
    self.addToHistoryDialog();
  }
}
