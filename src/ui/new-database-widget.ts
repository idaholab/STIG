/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { use_db } from './dbFunctions';
import { DatabaseConfigurationStorage } from '../storage';
import { IDatabaseConfigOptions } from '../storage/database-configuration-storage';

export function newDatabaseConfiguration (key?: string) {
  const dbdialog = new NewDatabaseDialog($('#new-db-anchor'), key);
  dbdialog.open();
}

const body = `    <p id="label">Host:</p>
<p>
    <input type="text" id="host" value="localhost">
    <p id="label">Port:</p>
    <input type="text" id="port" value="2424">
    <p id="label">Database Name:</p>
    <input type="text" id="db_name" value="">
    <p id="label">OrientDB Root User:</p>
    <input type="text" id="username" value="">
    <p id="label">OrientDB Root Password:</p>
    <input type="password" id="user_password" value="">
</p>
`;

class NewDatabaseDialog {
  public _storage: DatabaseConfigurationStorage;
  public _anchor: JQuery<HTMLElement>;
  public _list = '';
  public _header = "<div id='db-config-list'>";
  public _footer = '</div>'; // "</ol>";
  private readonly useConfig: string;

  constructor (anchor: JQuery, key?: string) {
    this._storage = DatabaseConfigurationStorage.Instance;
    this._anchor = anchor;
    this._footer = ''; // this._createDeleteButton();
    // this.populateHistoryDialog();
    key === undefined ? this.useConfig = this._storage.current : this.useConfig = key;
  }

  public addToDialog () {
    this._anchor.empty();
    this._anchor.html(this._header + body + this._footer);
    this.setupEventHandlers();
  }

  public setupEventHandlers () {

  }

  public isOpen (): boolean {
    return this._anchor.dialog('isOpen');
  }

  private loadData () {
    const params = this._storage.get(this.useConfig);
    $('#host').val(params.host);
    $('#port').val(params.port);
    $('#db_name').val(params.name);
    $('#username').val(params.username);
    $('#user_password').val(params.password);
    // $('#admin_user').val(params.admin_user);
    // $('#admin_password').val(params.admin_password);
  }

  private async saveData () {
    const options: IDatabaseConfigOptions = {
      host: $('#host').val() as string,
      port: $('#port').val() as number,
      name: $('#db_name').val() as string,
      username: $('#username').val() as string,
      password: $('#user_password').val() as string,
      // admin_user: $("#admin_user").val() as string,
      // admin_password: $("#admin_password").val() as string,
      usetoken: true
    };
    DatabaseConfigurationStorage.Instance.save(options);
    await use_db(options);
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
          text: 'Save',
          click: () => { void this.saveData(); }
        }
      ]
    });
    this._anchor.dialog('open');
    this.loadData();
  }
}
