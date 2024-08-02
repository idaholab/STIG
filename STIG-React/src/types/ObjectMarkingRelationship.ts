import { Identifier, Timestamp } from "./Core";
import { Relationship } from "./Relationship";

export type ObjectMarkingRelationship = Relationship & {
    type: 'relationship';
    relationship_type: 'applies-to';
    id: Identifier;
    source_ref: Identifier;
    target_ref: Identifier;
    created: Timestamp;
    modified: Timestamp;
    description: string;
}