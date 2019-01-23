/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import { BrowserWindow, dialog } from "electron";
import * as path from "path";

const processHangBtn = document.getElementById("process-hang");

processHangBtn.addEventListener("click", (_event) => {
    const hangWinPath = "file://" + path.join(__dirname, "static/process_hang.html");
    let win = new BrowserWindow({ width: 400, height: 320 });

    win.on("unresponsive", () => {
        const options = {
            buttons: ["Reload", "Close"],
            message: "This process is hanging.",
            title: "Renderer Process Hanging",
            type: "info",
        };
        dialog.showMessageBox(options, (index) => {
            if (index === 0) {
                win.reload();
            } else {
                win.close();
            }
        });
    });

    win.on("close", () => { win = null; });
    win.loadURL(hangWinPath);
    win.show();
});

const processCrashBtn = document.getElementById("process-crash");

processCrashBtn.addEventListener("click", () => {
    const crashWinPath = "file://" + path.join(__dirname, "static/process_crash.html");
    let win = new BrowserWindow({ width: 400, height: 320 });

    win.webContents.on("crashed", () => {
        const options = {
            buttons: ["Reload", "Close"],
            message: "This process has crashed.",
            title: "Renderer Process Crashed",
            type: "info",
        };
        dialog.showMessageBox(options, (index) => {
            if (index === 0) { win.reload(); } else { win.close(); }
        });
    });

    win.on("close",  () => { win = null; });
    win.loadURL(crashWinPath);
    win.show();
});
