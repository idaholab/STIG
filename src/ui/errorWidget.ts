/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

export class ErrorWidget {
    public _footer: string = '';
    public _header: string = '';
    public _anchor: JQuery<HTMLElement>;
    constructor(anchor: JQuery<HTMLElement>) {
        this._anchor = anchor;
        this._footer = "";
        anchor.dialog({
            autoOpen: true,
            height: 480,
            width: 640,
            modal: true,
            buttons: {
                OK: () => {$(this._anchor).dialog("close"); },
            },
        });
    }

    public open() {
        this._anchor.dialog("open");
    }

    public populate(title: string, contents: string) {
        this._header = `${title}`;
        const html = `${contents} ${this._footer}`;
        this._anchor.html(html);
    }
}
