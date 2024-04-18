/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { get_taxii, commit } from './dbFunctions';
import { DatabaseConfigurationStorage } from '../storage';
import { TaxiiParams } from '../storage/database-configuration-storage';
import { StixObject } from '../stix';

export function openConnectTaxii (key?: string) {
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
  public _list = '';
  public _header = "<div id='connect-taxii'>";
  public _footer = '</div>'; // "</ol>";
  private readonly useConfig: string;

  constructor (anchor: JQuery, key?: string) {
    this._storage = DatabaseConfigurationStorage.Instance;
    this._anchor = anchor;
    this._footer = '';
    this.useConfig = key ?? this._storage.current;
  }

  public addToDialog () {
    this._anchor.empty();
    this._anchor.html(this._header + body + this._footer);
  }

  public isOpen (): boolean {
    return this._anchor.dialog('isOpen');
  }

  private async saveData () {
    // Get user Taxii input
    const tax: TaxiiParams = {
      url: $('#url').val() as string,
      apiroot_name: $('#apiroot_name').val() as string,
      collection_id: $('#collection_id').val() as string,
      username: $('#tax_username').val() as string,
      password: $('#tax_password').val() as string
    };

    // Call backend taxii logic
    const objects = await get_taxii(tax); // await

    // Debugging
    if (objects) {
      $('.message-status').html(`${objects.length} TAXII objects found.`);
    } else {
      // add error message "No found Taxii objects"
      $('.message-status').html('No TAXII objects found.');
    }

    // Commit taxii objects to database
    const relationships: StixObject[] = [];
    const commits: Array<Promise<boolean>> = [];
    let i = 0;
    $('.message-status').html(`Committing ${objects.length} to the database...`);
    for (const obj of objects) {
      $('.message-status').html(`Committing object ${i++}/${objects.length} ...`);
      // Save relationships for later
      if (obj.type === 'relationship' || obj.type === 'sighting') {
        relationships.push(obj);
      } else {
        // Commit everything else
        commits.push(commit(obj));
      }
    }
    for (const rel of relationships) {
      $('.message-status').html(`Committing object ${i++}/${objects.length} ...`);
      commits.push(commit(rel));
    }

    const results = await Promise.all(commits);
    const committed = results.reduce((n, b) => n + (+b), 0);
    $('.message-status').html(`Successfully committed ${committed} out of ${objects.length} objects.`);

    this.close();
  }

  private close () {
    if (this.isOpen()) {
      this._anchor.dialog('close');
    }
  }

  public open () {
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
          click: () => { this.close(); }
        },
        {
          text: 'Upload TAXII to DB',
          click: async () => { await this.saveData(); }
        }
      ]
    });
    this._anchor.dialog('open');
  }
}
