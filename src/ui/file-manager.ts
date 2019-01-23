/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import { shell } from 'electron';
import * as  os from 'os';

export function show_item_in_folder() {
    shell.showItemInFolder(os.homedir());
}
