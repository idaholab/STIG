import { commit } from './dbFunctions';
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
