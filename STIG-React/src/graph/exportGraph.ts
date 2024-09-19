import fileSaver from 'file-saver';

import { BundleType } from '@/types/BundleType';

export function exportGraph(filename: string, bundle: BundleType) {
    if (filename === '') {
        // If it's blank, set the filename to bundle.json
        filename = 'bundle.json';
    } else {
        // Replace illegal characters with underscores
        filename = filename.replaceAll(/\/|<|>|:|"|\\|\||\?|\*|\./g, '_') + '.json';
    }

    // Convert to JSON and save
    const jsonToSave = JSON.stringify(bundle, null, 2);
    const jsonBundleSave = new Blob([jsonToSave], { type: 'application/json' });
    fileSaver.saveAs(jsonBundleSave, filename);
}