import { commit } from "../db/dbFunctions";
import { BundleType, StixObject } from "../stix";

export function openDatabaseUpload() {
    const dbUpload = new DatabaseUploadDialog($("#db-upload-anchor"))
    dbUpload.open()
}

const body = `<div class="mb-3">
<label for="bundleUploadFile" class="form-label">Bundle</label>
<input class="form-control" type="file" id="bundleUploadFile">
</div>`

class DatabaseUploadDialog {
    public _anchor: JQuery<HTMLElement>;
    public _header = "<div id='db-upload'>"
    public _footer = "</div>"

    constructor(anchor: JQuery) {
        this._anchor = anchor
    }

    private saveBundle() {
        const files = $("#bundleUploadFile").prop("files")
        for (var i = 0; i < files.length; i++) {
            if (files[i] && files[i] instanceof File) {
                const f = files[i];
                document.getElementById('chosen-files')!.innerText += f.name + " ";
                // hideMessages();

                const r = new FileReader();
                r.onload = (_e: Event) => {
                    // this.result
                    // addToGraph(JSON.parse(e.target.result))
                    // addToGraph(JSON.parse(r.result as string));
                    const bundle : BundleType = JSON.parse(r.result as string)
                    const objects : StixObject[] = bundle.objects as StixObject[]
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
                };
                r.readAsText(f);
            }
        }
    }

    public open() {
        this.addToDialog()
        this._anchor.dialog({
            autoOpen: true,
            modal: true,
            width: 'maxcontent',
            maxWidth: window.innerWidth / 2,
            maxHeight: window.innerHeight - 100,
            buttons: [
                {
                    text: 'Commit',
                    click: () => this.saveBundle()
                }
            ]
        });
        this._anchor.dialog("open");
    }

    public addToDialog() {
        this._anchor.empty();
        this._anchor.html(this._header + body + this._footer)
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