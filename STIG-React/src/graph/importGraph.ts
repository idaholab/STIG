import { AlertType } from "@/components/elements/AlertComponent";
import { readFiles } from "@/util/fileReader";
import { addToGraph } from "@/util/GraphUtils";
import { Core } from "cytoscape";

export interface ImportResult {
    alerts: { message: string, type: AlertType }[];
    layout: boolean;
};

export async function importGraph(cyInstance: Core, files: ArrayLike<File>): Promise<ImportResult> {
    let layout = false;
    const fileData = await readFiles(files);
    const alerts: { message: string, type: AlertType }[] = [];
    for (const { name, data } of fileData) {
        if (data === undefined) {
            alerts.push({ message: `Error reading ${name}`, type: "warning" });
            continue;
        }

        alerts.push({ message: `${name} successfully uploaded`, type: "success" });

        try {
            const parsedFile = JSON.parse(data);
            const [numVerticiesAdded, numEdgesAdded] = addToGraph(parsedFile, cyInstance!);

            if (parsedFile.metadata) { // Position the nodes
                for (const node of parsedFile.metadata) {
                    // Find the element on the graph
                    cyInstance!.$id(node.id).animate({
                        position: node.position,
                        duration: 1000,
                        complete: () => cyInstance!.fit()
                    });
                }
            } else {
                layout = true;
            }

            if (numVerticiesAdded < 0 && numEdgesAdded < 0) {
                alerts.push({ message: `Import of ${name} failed`, type: "error" });
            } else {
                alerts.push({
                    message: `Imported ${numVerticiesAdded} node(s) and ${numEdgesAdded} edge(s)`,
                    type: numVerticiesAdded === 0 && numEdgesAdded === 0 ? "warning" : "success",
                });
            }
        } catch(_) {
            alerts.push({ message: `Import of ${name} failed`, type: "error" });
        }
    }

    return { alerts, layout };
}