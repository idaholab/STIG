import fileSaver from 'file-saver';
import { BundleType } from '../stix';

export function openBundleExport (bundle: BundleType) {
  const bundleExport = new ExportBundleDialog($('#export-bundle-anchor'), bundle);
  bundleExport.open();
}

class ExportBundleDialog {
  public _anchor: JQuery<HTMLElement>;
  public _header = "<div id='bundle-export-widget'>";
  public _body = '<div class="mb-3"><label for="filenameInput" class="form-label">Filename</label><input class="form-control" type="text" id="filenameInput" placeholder="bundle"><span>.json</span></div>';
  public _footer = '</div>';
  private readonly bundle: BundleType;

  constructor (anchor: JQuery, bundle: BundleType) {
    this._anchor = anchor;
    this.bundle = bundle;
  }

  private export () {
    // Get the filename
    let filename = $('#filenameInput').prop('value');
    if (filename === '') {
      // If it's blank, set the filename to bundle.json
      filename = 'bundle.json';
    } else {
      // Replace illegal characters with underscores
      filename = filename.replaceAll(/\/|<|>|:|"|\\|\||\?|\*|\./g, '_') + '.json';
    }
    // console.log(filename)

    // Convert to JSON and save
    const jsonToSave = JSON.stringify(this.bundle, null, 2);
    const jsonBundleSave = new Blob([jsonToSave], { type: 'application/json' });
    fileSaver.saveAs(jsonBundleSave, filename);
    $('.message-status').html(`Exported ${this.bundle.objects.length} objects`);
    this.close();
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
          text: 'Export',
          click: () => { this.export(); }
        }
      ]
    });
    this._anchor.dialog('open');
  }

  public addToDialog () {
    this._anchor.empty();
    this._anchor.html(this._header + this._body + this._footer);
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
