/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import * as diffpatch from 'jsondiffpatch';
import { Identifier, StixObject } from '../stix';

export interface ITrackedItem {
  name: string;
  diff: diffpatch.Delta;
  original: any;
}

export interface IDialogEventData {
  self: any;
}

const html_style = `<style>
.jsondiffpatch-delta {
    font-family: 'Bitstream Vera Sans Mono', 'DejaVu Sans Mono', Monaco, Courier, monospace;
    font-size: 12px;
    margin: 0;
    padding: 0 0 0 12px;
    display: inline-block;
  }
  .jsondiffpatch-delta pre {
    font-family: 'Bitstream Vera Sans Mono', 'DejaVu Sans Mono', Monaco, Courier, monospace;
    font-size: 12px;
    margin: 0;
    padding: 0;
    display: inline-block;
  }
  ul.jsondiffpatch-delta {
    list-style-type: none;
    padding: 0 0 0 20px;
    margin: 0;
  }
  .jsondiffpatch-delta ul {
    list-style-type: none;
    padding: 0 0 0 20px;
    margin: 0;
  }
  .jsondiffpatch-added .jsondiffpatch-property-name,
  .jsondiffpatch-added .jsondiffpatch-value pre,
  .jsondiffpatch-modified .jsondiffpatch-right-value pre,
  .jsondiffpatch-textdiff-added {
    background: #bbffbb;
  }
  .jsondiffpatch-deleted .jsondiffpatch-property-name,
  .jsondiffpatch-deleted pre,
  .jsondiffpatch-modified .jsondiffpatch-left-value pre,
  .jsondiffpatch-textdiff-deleted {
    background: #ffbbbb;
    text-decoration: line-through;
  }
  .jsondiffpatch-unchanged,
  .jsondiffpatch-movedestination {
    color: gray;
  }
  .jsondiffpatch-unchanged,
  .jsondiffpatch-movedestination > .jsondiffpatch-value {
    transition: all 0.5s;
    -webkit-transition: all 0.5s;
    overflow-y: hidden;
  }
  .jsondiffpatch-unchanged-showing .jsondiffpatch-unchanged,
  .jsondiffpatch-unchanged-showing .jsondiffpatch-movedestination > .jsondiffpatch-value {
    max-height: 100px;
  }
  .jsondiffpatch-unchanged-hidden .jsondiffpatch-unchanged,
  .jsondiffpatch-unchanged-hidden .jsondiffpatch-movedestination > .jsondiffpatch-value {
    max-height: 0;
  }
  .jsondiffpatch-unchanged-hiding .jsondiffpatch-movedestination > .jsondiffpatch-value,
  .jsondiffpatch-unchanged-hidden .jsondiffpatch-movedestination > .jsondiffpatch-value {
    display: block;
  }
  .jsondiffpatch-unchanged-visible .jsondiffpatch-unchanged,
  .jsondiffpatch-unchanged-visible .jsondiffpatch-movedestination > .jsondiffpatch-value {
    max-height: 100px;
  }
  .jsondiffpatch-unchanged-hiding .jsondiffpatch-unchanged,
  .jsondiffpatch-unchanged-hiding .jsondiffpatch-movedestination > .jsondiffpatch-value {
    max-height: 0;
  }
  .jsondiffpatch-unchanged-showing .jsondiffpatch-arrow,
  .jsondiffpatch-unchanged-hiding .jsondiffpatch-arrow {
    display: none;
  }
  .jsondiffpatch-value {
    display: inline-block;
  }
  .jsondiffpatch-property-name {
    display: inline-block;
    padding-right: 5px;
    vertical-align: top;
  }
  .jsondiffpatch-property-name:after {
    content: ': ';
  }
  .jsondiffpatch-child-node-type-array > .jsondiffpatch-property-name:after {
    content: ': [';
  }
  .jsondiffpatch-child-node-type-array:after {
    content: '],';
  }
  div.jsondiffpatch-child-node-type-array:before {
    content: '[';
  }
  div.jsondiffpatch-child-node-type-array:after {
    content: ']';
  }
  .jsondiffpatch-child-node-type-object > .jsondiffpatch-property-name:after {
    content: ': {';
  }
  .jsondiffpatch-child-node-type-object:after {
    content: '},';
  }
  div.jsondiffpatch-child-node-type-object:before {
    content: '{';
  }
  div.jsondiffpatch-child-node-type-object:after {
    content: '}';
  }
  .jsondiffpatch-value pre:after {
    content: ',';
  }
  li:last-child > .jsondiffpatch-value pre:after,
  .jsondiffpatch-modified > .jsondiffpatch-left-value pre:after {
    content: '';
  }
  .jsondiffpatch-modified .jsondiffpatch-value {
    display: inline-block;
  }
  .jsondiffpatch-modified .jsondiffpatch-right-value {
    margin-left: 5px;
  }
  .jsondiffpatch-moved .jsondiffpatch-value {
    display: none;
  }
  .jsondiffpatch-moved .jsondiffpatch-moved-destination {
    display: inline-block;
    background: #ffffbb;
    color: #888;
  }
  .jsondiffpatch-moved .jsondiffpatch-moved-destination:before {
    content: ' => ';
  }
  ul.jsondiffpatch-textdiff {
    padding: 0;
  }
  .jsondiffpatch-textdiff-location {
    color: #bbb;
    display: inline-block;
    min-width: 60px;
  }
  .jsondiffpatch-textdiff-line {
    display: inline-block;
  }
  .jsondiffpatch-textdiff-line-number:after {
    content: ',';
  }
  .jsondiffpatch-error {
    background: red;
    color: white;
    font-weight: bold;
  }
  </style>`;

export class DiffDialog {
  public html: string;
  public tracked: Record<string, ITrackedItem>;
  public diffpatcher: diffpatch.DiffPatcher;
  public config: diffpatch.Config;
  private readonly _anchor: JQuery<HTMLElement>;
  private readonly _header: string = `${html_style} <div id="diff-list">`;
  private readonly _footer: string = '</div>'; // + this._createUpdateDBButton();

  constructor (anchor: JQuery) {
    this._anchor = anchor;
    this.html = this._header;
    this.tracked = {};
    this.config = {
      arrays: {
        detectMove: true,
        includeValueOnMove: false
      },
      propertyFilter: (name: string, _context: diffpatch.DiffContext) => {
        if (name.startsWith('@', 0)) {
          return false;
        }
        return true;
      }
    };
    this.diffpatcher = new diffpatch.DiffPatcher(this.config);
  }

  public addDiff (id: Identifier, dif: diffpatch.Delta, orig: StixObject, name?: string) {
    if (id in this.tracked) {
      if (dif !== this.tracked[id]) {
        this.tracked[id].diff = dif;
      }
    } else {
      this.tracked[id] = { name: name ?? '', diff: dif, original: orig };
    }
  }

  public clearId (id: Identifier) {
    if (id in this.tracked) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.tracked[id];
      this._buildHTML();
      this._anchor.html(this.html);
      ($("input[type='radio']") as any).checkboxradio();
    }
  }

  public reset () {
    this.html = '';
    this._anchor.html('');
    this.tracked = {};
  }

  private _buildHTML () {
    this.html = this._header;
    for (const k in this.tracked) {
      if (Object.prototype.hasOwnProperty.call(this.tracked, k)) {
        const name = this.tracked[k].name ? this.tracked[k].name : k;
        const type = k.split('--', 1)[0];
        const formatted = diffpatch.formatters.html.format(this.tracked[k].diff, this.tracked[k].original);
        const radiobutton = this._createRadioButton(k);
        this.html += `<h3>${type}: ${name}</h3>
            <div x-diff-key="${k}">
            <fieldset>
            <p>ID: ${k}</p>
            ${formatted}
            ${radiobutton}
            </fieldset>
            </div>`;
      }
    }
    this.html += this._footer;
  }

  private _createRadioButton (index: string) {
    const but: string = `<fieldset>
        <label for="radio-local-${index}"> Keep Local </label>
        <input type="radio" name="radio-${index}" id="radio-local-${index}">
        <label for="radio-db-${index}"> Use DB </label>
        <input type="radio" name="radio-${index}" id="radio-db-${index}">
        </fieldset>`;
    return but;
  }

  public open () {
    this._anchor.empty();
    this._buildHTML();
    this._anchor.html(this.html);
    ($("input[type='radio']") as any).checkboxradio();
    this._anchor.dialog({ autoOpen: false });
    this._anchor.dialog('option', {
      width: '50%',
      // height: '75%',
      maxHeight: window.innerHeight - 100,
      maxWidth: window.innerWidth / 2,
      buttons: [{
        text: 'Commit',
        id: 'diff-dialog-commit-btn',
        click: (e: JQueryEventObject) => { this._doUpdateAsSelected(e); }
      }, {
        text: 'Close',
        click: this._close
      }]
    });
    this._anchor.dialog('open');
  }

  private _close (_e: JQueryEventObject) {
    $(this).dialog('close');
  }

  private _doUpdateAsSelected (e: JQueryEventObject): void {
    e.stopPropagation();
    e.preventDefault();
    const ids: Identifier[] = [];
    let stix_id: string;
    $("input[type='radio']:checked").each((_index, ele) => {
      const id = ele.getAttribute('id');
      if (!id) {
        return;
      }
      if (id.startsWith('radio-db-')) {
        stix_id = id.split('radio-db-')[1];
        ids.push(stix_id);
      } else {
        stix_id = id.split('radio-local-')[1];
        this.clearId(stix_id);
      }
    });
    this.updateNode(ids);
    this._anchor.dialog('close');
  }

  private updateNode (ids: Identifier[]): void {
    let nodes: cytoscape.CollectionReturnValue;
    for (const stix_id of ids) {
      const diff = this.tracked[stix_id].original;
      nodes = window.cycore.getElementById(stix_id);
      if (nodes.length > 0) {
        nodes.each((n) => {
          n.data('raw_data', diff);
          n.data('saved', true);
        });
      }
      this.clearId(stix_id);
    }
  }
}
