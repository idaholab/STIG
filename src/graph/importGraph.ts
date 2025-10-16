import { AlertType } from "@/components/elements/AlertComponent";
import { isRelationship } from "@/db/neo4j/isRelationship";
import { isValidStix } from "@/stix/stix";
import { StixObjectCheck } from "@/types/StixObjectCheck";
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

export async function* importGraphToView(cyInstance: Core, files: ArrayLike<File>): AsyncGenerator<ImportResult> {
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
                yield {
                    alert: {
                        message: `Imported ${numVerticiesAdded} node(s) and ${numEdgesAdded} edge(s)`,
                        type: numVerticiesAdded === 0 && numEdgesAdded === 0 ? "warning" : "success",
                    }, layout
                };
            }
        } catch (_) {
            yield { alert: { message: `Import of ${name} failed`, type: "error" }, layout };
        }
    }
}

export async function* importGraphToDB(files: ArrayLike<File>): AsyncGenerator<ImportResult, undefined, undefined> {
    for (const file of Array.from(files)) {
        const { nodes, rels, errors } = await readFileToObjects(file);
        let result;
        if (errors.length === 0) {
            result = await commitArray(nodes, rels);
        }

        const errorMessages = errors.map(error => error.invalidReason).join('\n');
        const message = errors.length === 0 ? `Imported ${result?.ncommit ?? 0} node(s) and ${result?.rcommit ?? 0} edge(s) from ${file.name} with ${errors.length} error(s).`
            : `An error occurred while saving to the database.\n ${(errors.length > 0 ? `Errors:\n ${errorMessages}` : '')}`;
        yield {
            alert: {
                message: message,
                type: errors.length === 0 ? "success" : "warning" as AlertType
            },
            layout: false,
        };
    }
}

async function readFileToObjects(file: File): Promise<{ nodes: StixObject[]; rels: StixRelationshipObject[]; errors: StixObjectCheck[]; }> {
    const nodes: StixObject[] = [];
    const rels: StixRelationshipObject[] = [];
    let errors: StixObjectCheck[] = [];

    for await (const obj of streamStixFile(file)) {
        let check = isValidStix(obj);
        if (check.isValid) {
            (isRelationship(obj) ? rels : nodes).push(obj);
        }
        else {
            errors.push(check);
        }
    }
    return { nodes, rels, errors };
}

async function commitArray(nodes: StixObject[], rels: StixRelationshipObject[]): Promise<{ ncommit: number, rcommit: number, errors: number }> {
    let ncommit = 0, rcommit = 0, errors = 0;
    const batchSize = 250;
    while (nodes.length + rels.length > 0) {
        const nodeBatch = nodes.splice(0, batchSize);
        const relBatch = rels.splice(0, batchSize);
        const { nodes: nc, edges: rc, errors: ec } = await commit(nodeBatch, relBatch);
        ncommit += nc;
        rcommit += rc;
        errors += ec;
    }
    return { ncommit, rcommit, errors };
}