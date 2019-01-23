/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { BrowserWindow, dialog, Rectangle, screen, app } from "electron";
import ElectronStore = require("electron-store");

export interface IWindowStatus {
    x: number;
    y: number;
    width: number;
    height: number;
    maximized: boolean;
    fullscreen: boolean;
    display_bounds: Rectangle;
    initial: boolean;
}

export class WindowManager {
    private _window: BrowserWindow;
    public maximize: boolean;
    public fullscreen: boolean;
    public debounce_timer: NodeJS.Timer;
    public status: IWindowStatus;
    public store: ElectronStore<IWindowStatus>;

    constructor() {
        // this.debounce_timer = setTimeout(this.update, 100);
        this.store = new ElectronStore<IWindowStatus>({ name: "stig_window_status" });
        this.status = this.store.store;
        if (!this.store.has("x")) {
            this.init_store();
        }
    }

    private init_store() {
        if (!this._window) {
            const screen_bounds = screen.getPrimaryDisplay().bounds;
            if (!this.store.has("width")) { this.store.set("width", 1024); }
            if (!this.store.has("height")) { this.store.set("height", 768); }
            if (!this.store.has("x")) {
                this.store.set("x", screen_bounds.width / 2 - this.width / 2);
            }
            if (!this.store.has("y")) {
                this.store.set("y", screen_bounds.height / 2 - this.height / 2);
            }

            if (!this.store.has("maximized")) { this.store.set("maximized", false); }
            if (!this.store.has("fullscreen")) { this.store.set("fullscreen", false); }
            if (!this.store.has("display_bounds")) { this.store.set("display_bounds", screen_bounds); }
        } else {
            if (!this.store.has("x")) { this.store.set("x", this.x); }
            if (!this.store.has("y")) { this.store.set("y", this.y); }
            if (!this.store.has("width")) { this.store.set("width", this.width); }
            if (!this.store.has("height")) { this.store.set("height", this.height); }
            if (!this.store.has("maximized")) { this.store.set("maximized", this._window.isMaximized()); }
            if (!this.store.has("fullscreen")) { this.store.set("fullscreen", this._window.isFullScreen()); }
            if (!this.store.has("display_bounds")) { this.store.set("display_bounds", screen.getDisplayMatching(this._window.getBounds()).bounds); }
        }
        this.status = this.store.store;
    }

    private load() {
        this.init_store();
    }

    public is_initial(): boolean {
        return !this.store.has("x");
    }

    set window(win: BrowserWindow) {
        this._window = win;
        this.load();
    }

    get window() {
        return this._window;
    }

    public update() {
        if (!this._window) {
            return;
        }
        this.status.initial = false;
        this.status.maximized = this._window.isMaximized();
        this.status.fullscreen = this._window.isFullScreen();
        this.status.display_bounds = screen.getDisplayMatching(this._window.getBounds()).bounds;
        if (!this._window.isMaximized() && !this._window.isMinimized() && !this._window.isFullScreen()) {
            try {
                const winBounds = this._window.getBounds();
                this.status.x = winBounds.x;
                this.status.y = winBounds.y;
                this.status.width = winBounds.width;
                this.status.height = winBounds.height;
            } catch (err) {
                dialog.showErrorBox('Error Updating Window Status', err.toString());
            }
        }
        this.store.store = this.status;
    }

    public save() {
        if (this._window) {
            this.update();
        }
        this.store.store = this.status;
    }

    get x() { return this.status.x ? this.status.x : this.store.get("x"); }

    get y() { return this.status.y ? this.status.y : this.store.get("y"); }

    get width() { return this.status.width ? this.status.width : this.store.get("width"); }

    get height() { return this.status.height ? this.status.height : this.store.get("height"); }

    get isMaximized() { return this.status.maximized ? this.status.maximized : this.store.get("maximized"); }

    get isFullScreen() { return this.status.fullscreen ? this.status.fullscreen : this.store.get("fullscreen"); }
}

export function set_events() {
    if (winmgr.maximize && winmgr.status.maximized) {
        winmgr.window.maximize();
    }
    if (winmgr.fullscreen && winmgr.status.fullscreen) {
        winmgr.window.setFullScreen(true);
    }
    winmgr.window.on('resize', changed);
    winmgr.window.on('move', changed);
    winmgr.window.on('close', window_close_handler);
    winmgr.window.on('closed', window_did_close);
}

export function remove_events() {
    if (winmgr.window) {
        winmgr.window.removeListener('resize', changed);
        winmgr.window.removeListener('move', changed);
        clearTimeout(winmgr.debounce_timer);
        winmgr.window.removeListener('close', window_close_handler);
        winmgr.window.removeListener('closed', window_did_close);
        winmgr.window = null;
    }
}

function changed(_e: Event) {
    clearTimeout(winmgr.debounce_timer);
    const callback = () => {
        winmgr.update();
    };
    winmgr.debounce_timer = setTimeout(callback, 100);
}

function window_close_handler() {
    winmgr.update();
}

function window_did_close() {
    winmgr.store.store = winmgr.status;
    remove_events();
}

app.on('ready', () => {
    winmgr = new WindowManager();
    instance = winmgr;
});

let winmgr: WindowManager;
export declare var instance: WindowManager;
