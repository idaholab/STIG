import { AlertType } from "@/components/elements/AlertComponent";
import { isRelationship } from "@/db/neo4j/isRelationship";
import { StixObject } from "@/types/stixTypes/StixObject";
import { StixRelationshipObject } from "@/types/stixTypes/StixRelationshipObject";
import { commit } from "@/util/DbFunctions";
import { readFiles, streamStixFile } from "@/util/fileReader";
import { addToGraph } from "@/util/GraphUtils";
import { Core } from "cytoscape";

export interface ImportResult {
    alert: { message: string, type: AlertType };
    layout: boolean;
};

export async function * importGraphToView(cyInstance: Core, files: ArrayLike<File>): AsyncGenerator<ImportResult> {
    let layout = false;
    const fileData = await readFiles(files);
    for (const { name, data } of fileData) {
        if (data === undefined) {
            yield { alert: { message: `Error reading ${name}`, type: "warning" }, layout };
            continue;
        }

        yield { alert: { message: `${name} successfully read`, type: "success" }, layout };

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
                yield { alert: { message: `Import of ${name} failed`, type: "error" }, layout };
            } else {
                yield { alert: {
                    message: `Imported ${numVerticiesAdded} node(s) and ${numEdgesAdded} edge(s)`,
                    type: numVerticiesAdded === 0 && numEdgesAdded === 0 ? "warning" : "success",
                }, layout };
            }
        } catch(_) {
            yield { alert: { message: `Import of ${name} failed`, type: "error" }, layout };
        }
    }
}

export async function * importGraphToDB(files: ArrayLike<File>): AsyncGenerator<ImportResult, undefined, undefined> {
    const nodes: StixObject[] = [];
    const rels: StixRelationshipObject[] = [];
    for (const file of Array.from(files)) {
        let ncommit = 0, rcommit = 0, errors = 0;

        async function commitBatch() {
            const { nodes: nc, edges: rc, errors: ec } = await commit(nodes, rels);
            if (rc === 0 && nc === 0 && ec === 0) return [];
            rcommit += rc;
            ncommit += nc;
            errors += ec;
            nodes.length = 0;
            rels.length = 0;
        
            return [{
                alert: {
                    message: `Imported ${ncommit} node(s) and ${rcommit} edge(s) from ${file.name} with ${errors} error(s).`,
                    type: errors === 0 ? "success" : "warning" as AlertType
                },
                layout: false,
            }];
        }

        yield { alert: { message: `Reading ${file.name}`, type: "info" }, layout: false };
        for await (const obj of streamStixFile(file)) {
            (isRelationship(obj) ? rels : nodes).push(obj);
            if (nodes.length + rels.length >= 250) yield * await commitBatch();
        }
        if (nodes.length + rels.length > 0) yield * await commitBatch();
        yield {
            alert: { message: `Imported all objects from ${file.name} with ${errors} error(s).`, type: "info" },
            layout: false,
        };
    }
}