/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

 import { ipcRenderer } from "electron";
 import { JSONObject } from '../types/globals';

// Renderer process

 function cancel() {
        ipcRenderer.send("closeDialog", undefined);
        close();
}

 function send_data_close(_event: MouseEvent) {
        const options = {
            host: (document.getElementById("host") as HTMLInputElement).value,
            port: (document.getElementById("port") as HTMLInputElement).value,
            name: (document.getElementById("db_name") as HTMLInputElement).value,
            username: (document.getElementById("userid") as HTMLInputElement).value,
            password: (document.getElementById("password") as HTMLInputElement).value,
            useToken: true,
        };
        ipcRenderer.send("closeDialog", options);
    }

 ipcRenderer.on('config_options', (_event: Electron.Event, _opt: JSONObject) => {
        const options = ipcRenderer.sendSync("DialogReady", "");
        const params = JSON.parse(options);
        document.getElementById('host').innerHTML = params.host;
        document.getElementById('port').innerHTML = params.port;
        document.getElementById('db_name').innerHTML = params.db_name;
        document.getElementById('userid').innerHTML = params.userid;
        document.getElementById('password').innerHTML = params.password;
    });

 document.getElementById('btn-ok').onclick = send_data_close;
 document.getElementById('btn-cancel').onclick = cancel;
