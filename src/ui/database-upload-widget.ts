import { commitBundle } from './dbFunctions';
import { BundleType, StixObject } from '../stix';

export function openDatabaseUpload () {
  const dbUpload = new DatabaseUploadDialog($('#db-upload-anchor'));
  dbUpload.open();
}

const body = `<div class="mb-3">
<label for="bundleUploadFile" class="form-label">Bundle</label>
<input class="form-control" type="file" id="bundleUploadFile">
</div>`;

class DatabaseUploadDialog {
  public _anchor: JQuery<HTMLElement>;
  public _header = "<div id='db-upload'>";
  public _footer = '</div>';

  constructor (anchor: JQuery) {
    this._anchor = anchor;
  }

  private saveBundle () {
    const files = $('#bundleUploadFile').prop('files');
    for (let i = 0; i < files.length; i++) {
      if (files[i] && files[i] instanceof File) {
        const f = files[i];
        document.getElementById('chosen-files')!.innerText += f.name + ' ';
        // hideMessages();

        const r = new FileReader();
        r.onload = async (_e: Event) => {
          const bundle: BundleType = JSON.parse(r.result as string);
          const objects: StixObject[] = bundle.objects as StixObject[];
          $('.message-status').html(`Committing ${bundle.objects.length} to the database...`);
          const [nodes, edges] = await commitBundle(bundle);
          $('.message-status').html(`Successfully committed ${nodes.size} nodes and ${edges.size} edges out of ${objects.length} objects.`);
          this.close();
        };
        r.readAsText(f);
      }
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
          text: 'Commit',
          click: () => { this.saveBundle(); }
        }
      ]
    });
    this._anchor.dialog('open');
  }

  public addToDialog () {
    this._anchor.empty();
    this._anchor.html(this._header + body + this._footer);
  }

  public isOpen (): boolean {
    return this._anchor.dialog('isOpen');
  }

  private close () {
    if (this.isOpen()) {
      this._anchor.dialog('close');
    }
  }
}
