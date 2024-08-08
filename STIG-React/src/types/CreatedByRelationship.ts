import { Identifier, Timestamp } from "./Core";
import { Relationship } from "./Relationship";

export type CreatedByRelationship = Relationship & {
    type: 'relationship';
    relationship_type: 'created-by';
    source_ref: Identifier;
    target_ref: Identifier;
    id: Identifier;
    description: string;
    created: Timestamp;
    modified: Timestamp;
}